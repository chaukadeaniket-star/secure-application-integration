import { Check } from 'lucide-react';

const steps = [
  { title: 'API connection', subtitle: 'Fetch and display data', state: 'complete' },
  { title: 'Application form', subtitle: 'Build and validate', state: 'active' },
  { title: 'Security', subtitle: 'Protect and harden', state: 'upcoming' },
  { title: 'Tests & submit', subtitle: 'Complete and submit', state: 'upcoming' }
];

export default function ProgressSteps({ current = 1 }) {
  return (
    <div className="stepper" aria-label="Task progress">
      {steps.map((step, index) => {
        const state = index < current ? 'complete' : index === current ? 'active' : 'upcoming';
        return (
          <div className={`step ${state}`} key={step.title}>
            <span className="step-marker">{state === 'complete' ? <Check size={17} /> : index + 1}</span>
            <div className="step-copy"><strong>{step.title}</strong><span>{step.subtitle}</span></div>
          </div>
        );
      })}
    </div>
  );
}
