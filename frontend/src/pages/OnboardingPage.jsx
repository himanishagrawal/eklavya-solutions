import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Logo from '../components/ui/Logo.jsx';
import Button from '../components/ui/Button.jsx';
import StepIndicator from '../components/onboarding/StepIndicator.jsx';
import PersonalStep from '../components/onboarding/PersonalStep.jsx';
import CareerStep from '../components/onboarding/CareerStep.jsx';
import SkillsStep from '../components/onboarding/SkillsStep.jsx';
import ReviewStep from '../components/onboarding/ReviewStep.jsx';
import { useAuth } from '../hooks/useAuth.js';
import * as studentService from '../services/studentService.js';
import * as skillService from '../services/skillService.js';

const STEPS = ['Personal', 'Career', 'Skills', 'Review'];

const INITIAL_VALUES = {
  fullName: '',
  city: '',
  district: '',
  state: '',
  college: '',
  degree: '',
  semester: '',
  graduationYear: '',
  targetIndustry: '',
  targetRole: '',
  targetLocation: '',
  workPreference: '',
  certifications: '',
  projects: '',
  internshipExperience: '',
  resumeUrl: '',
};

export default function OnboardingPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [values, setValues] = useState({ ...INITIAL_VALUES, fullName: user?.student?.fullName || '' });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const studentId = user?.student?.id;

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (step) => {
    const stepErrors = {};
    if (step === 1 && !values.fullName.trim()) {
      stepErrors.fullName = 'Full name is required';
    }
    if (step === 2 && !values.targetRole) {
      stepErrors.targetRole = 'Select a target role so we can tailor recommendations';
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!studentId) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      // 1. Persist personal + career + optional profile fields
      await studentService.updateStudent(studentId, {
        ...values,
        graduationYear: values.graduationYear ? Number(values.graduationYear) : null,
      });

      // 2. Persist each selected skill (add-or-update proficiency)
      await Promise.all(
        selectedSkills.map((s) =>
          skillService.addOrUpdateStudentSkill(studentId, { skillId: s.skillId, proficiency: s.proficiency })
        )
      );

      // 3. Mark onboarding complete (recomputes profileCompletion server-side)
      await studentService.completeOnboarding(studentId);

      // 4. Refresh the session's user/student data across the app
      await refreshUser();

      navigate('/app/dashboard', { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong while saving your onboarding. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base bg-grid-fade px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex justify-center">
          <Logo size={30} />
        </div>

        <div className="surface-card p-6 sm:p-8">
          <StepIndicator steps={STEPS} currentStep={currentStep} />

          <div className="mt-8">
            <h1 className="font-display text-xl font-semibold text-ink sm:text-2xl">
              {currentStep === 1 && 'Tell us about yourself'}
              {currentStep === 2 && 'What are you working towards?'}
              {currentStep === 3 && 'What skills do you already have?'}
              {currentStep === 4 && 'Almost done'}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              {currentStep === 1 && 'This helps us tailor content to your background.'}
              {currentStep === 2 && 'Your target role drives your skill-gap analysis in a later phase.'}
              {currentStep === 3 && 'Add every skill you have, even beginner-level ones.'}
              {currentStep === 4 && 'Add anything extra, then review and submit.'}
            </p>
          </div>

          {submitError && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="mt-6"
            >
              {currentStep === 1 && <PersonalStep values={values} errors={errors} onChange={handleChange} />}
              {currentStep === 2 && <CareerStep values={values} errors={errors} onChange={handleChange} />}
              {currentStep === 3 && (
                <SkillsStep selectedSkills={selectedSkills} onChangeSkills={setSelectedSkills} />
              )}
              {currentStep === 4 && (
                <ReviewStep values={values} selectedSkills={selectedSkills} onChange={handleChange} />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between border-t border-surface-border/70 pt-6">
            <Button variant="ghost" icon={ArrowLeft} onClick={goBack} disabled={currentStep === 1 || submitting}>
              Back
            </Button>

            {currentStep < STEPS.length ? (
              <Button variant="primary" icon={ArrowRight} onClick={goNext}>
                Continue
              </Button>
            ) : (
              <Button variant="primary" icon={CheckCircle2} onClick={handleSubmit} isLoading={submitting}>
                Complete onboarding
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
