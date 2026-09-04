import { useState } from 'react';
import { mccumberDimensions } from '../../content/cit017/foundations';

type Goal = (typeof mccumberDimensions.goals)[number];
type InformationState = (typeof mccumberDimensions.states)[number];
type Safeguard = (typeof mccumberDimensions.safeguards)[number];

const shortSafeguard: Record<Safeguard, string> = {
  Technology: 'Technology',
  'Policy and practices': 'Policy',
  'Education, training, and awareness': 'People',
};

export function McCumberCube() {
  const [goal, setGoal] = useState<Goal>('Confidentiality');
  const [informationState, setInformationState] = useState<InformationState>('Storage');
  const [safeguard, setSafeguard] = useState<Safeguard>('Technology');

  return (
    <section className="mccumber" aria-labelledby="cube-heading">
      <div className="mccumber-copy">
        <p className="section-label">3 × 3 × 3 model</p>
        <h3 id="cube-heading">Build one security intersection</h3>
        <p>Select one item from each dimension. The cube creates 27 combinations to check when protecting information.</p>

        <CubeAxis label="Security goal" values={mccumberDimensions.goals} selected={goal} onSelect={(value) => setGoal(value as Goal)} />
        <CubeAxis label="Information state" values={mccumberDimensions.states} selected={informationState} onSelect={(value) => setInformationState(value as InformationState)} />
        <CubeAxis label="Safeguard" values={mccumberDimensions.safeguards} selected={safeguard} onSelect={(value) => setSafeguard(value as Safeguard)} />
      </div>

      <div className="cube-stage" aria-hidden="true">
        <div className="cube-model">
          <div className="cube-face cube-face-top">{informationState}</div>
          <div className="cube-face cube-face-left">{goal}</div>
          <div className="cube-face cube-face-right">{shortSafeguard[safeguard]}</div>
        </div>
      </div>

      <p className="cube-result" role="status">
        Use <strong>{safeguard}</strong> to protect <strong>{goal}</strong> while information is in <strong>{informationState}</strong>.
      </p>
    </section>
  );
}

function CubeAxis({
  label,
  values,
  selected,
  onSelect,
}: {
  label: string;
  values: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <fieldset className="cube-axis">
      <legend>{label}</legend>
      <div>
        {values.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={selected === value}
            onClick={() => onSelect(value)}
          >
            {value}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
