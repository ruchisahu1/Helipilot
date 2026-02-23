export interface ScenarioAction {
    id: string;
    label: string;
    description: string;
    isCorrect: boolean;
    feedback: string;
}

export interface Scenario {
    id: string;
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    aiAdvisory: string;
    actions: ScenarioAction[];
}

export const SCENARIOS: Scenario[] = [
    {
        id: 'tail-rotor-failure',
        title: 'Tail Rotor Failure',
        description: 'Tail rotor blades are not spinning. Rotor speed dropping dangerously. Sudden nose right yaw. Anti-torque pedals non-responsive. Helicopter beginning to spin.',
        priority: 'HIGH',
        aiAdvisory: 'Lose of directional control. Enter autorotation immediately to eliminate torque.',
        actions: [
            {
                id: 'autorotate',
                label: 'Enter Autorotation',
                description: 'Lower collective to bottom, reduce engine power to idle.',
                isCorrect: true,
                feedback: 'Correct. Removing engine torque stops the spin and allows for a controlled descent.'
            },
            {
                id: 'full-throttle',
                label: 'Apply Full Power',
                description: 'Try to climb out of the spin with maximum engine thrust.',
                isCorrect: false,
                feedback: 'Fatal error. Increasing power increases torque, making the spin faster and more violent.'
            },
            {
                id: 'cyclic-compensation',
                label: 'Cyclic Compensation',
                description: 'Use full left cyclic to counter the right-hand rotation.',
                isCorrect: false,
                feedback: 'Incorrect. Cyclic cannot compensate for a total loss of anti-torque thrust.'
            }
        ]
    },
    {
        id: 'bird-strike',
        title: 'Bird Strike Detected',
        description: 'Impact on engine #1 during climb. Slight vibration detected. Engine parameters fluctuating.',
        priority: 'HIGH',
        aiAdvisory: 'Immediate decision required. Evaluate options carefully.',
        actions: [
            {
                id: 'reduce-thrust',
                label: 'Reduce Thrust & Assess',
                description: 'Lower engine power, monitor instruments, evaluate damage.',
                isCorrect: true,
                feedback: 'Correct. Reducing thrust prevents further damage while you assess the situation.'
            },
            {
                id: 'emergency-return',
                label: 'Emergency Return',
                description: 'Declare emergency and return to departure airport immediately.',
                isCorrect: false,
                feedback: 'Premature. You should assess the damage before making a full emergency landing if possible.'
            },
            {
                id: 'continue-flight',
                label: 'Continue Normal Flight',
                description: 'Birds hits happen often. Engines are designed to handle it.',
                isCorrect: false,
                feedback: 'Dangerous. A bird strike can lead to catastrophic engine failure if ignored.'
            }
        ]
    },
    {
        id: 'skid-damage',
        title: 'Damaged Landing Skid',
        description: 'Left skid assembly showing structural cracks after hard contact. Ground resonance risk high.',
        priority: 'MEDIUM',
        aiAdvisory: 'Standard landing may result in dynamic rollover. Special procedures required.',
        actions: [
            {
                id: 'shallow-approach',
                label: 'Flat/Shallow Approach',
                description: 'Land on a smooth surface with minimal vertical descent rate.',
                isCorrect: true,
                feedback: 'Correct. A slow, flat landing onto the healthy skid first minimizes the risk of rollover.'
            },
            {
                id: 'hover-exit',
                label: 'Jump Exit Hover',
                description: 'Hover at 5ft and have crew jump out to lighten the load.',
                isCorrect: false,
                feedback: 'Dangerous. Shifting weight during a hover with mechanical damage is prohibited.'
            },
            {
                id: 'vertical-drop',
                label: 'Direct Vertical Landing',
                description: 'Drop vertically to ensure both skids touch at the exact same time.',
                isCorrect: false,
                feedback: 'Incorrect. Impact force could cause the shattered skid to collapse entirely.'
            }
        ]
    },
    {
        id: 'oil-pressure',
        title: 'Low Oil Pressure Warning',
        description: 'Main gearbox oil pressure dropping rapidly. Caution light illuminated.',
        priority: 'HIGH',
        aiAdvisory: 'Gearbox failure imminent. Land as soon as possible.',
        actions: [
            {
                id: 'land-immediately',
                label: 'Land Immediately',
                description: 'Find the nearest clear area and perform an emergency landing.',
                isCorrect: true,
                feedback: 'Correct. Total gearbox failure results in loss of rotor control. Landing immediately is vital.'
            },
            {
                id: 'increase-speed',
                label: 'Increase Speed to Destination',
                description: 'Try to reach the terminal pad before pressure hits zero.',
                isCorrect: false,
                feedback: 'Incorrect. Higher speed increases gearbox load, accelerating failure.'
            },
            {
                id: 'reset-avionics',
                label: 'Reset Avionics',
                description: 'Check if it is a sensor malfunction by cycling avionics power.',
                isCorrect: false,
                feedback: 'Fatal error. Never ignore primary mechanical warnings as sensor errors.'
            }
        ]
    },
    {
        id: 'severe-turbulence',
        title: 'Severe Unforecast Turbulence',
        description: 'Entering localized cell with vertical gusts exceeding airframe limits.',
        priority: 'MEDIUM',
        aiAdvisory: 'Maintain control. Avoid over-stressing the airframe.',
        actions: [
            {
                id: 'slow-to-va',
                label: 'Slow to Maneuvering Speed',
                description: 'Reduce airspeed to Va to minimize structural load.',
                isCorrect: true,
                feedback: 'Correct. Maneuvering speed (Va) provides the best protection against structural damage.'
            },
            {
                id: 'climb-rapidly',
                label: 'Climb Rapidly',
                description: 'Try to get above the turbulence layer as fast as possible.',
                isCorrect: false,
                feedback: 'Incorrect. Rapid climbing in turbulence can cause an aerodynamic stall or exceed g-limits.'
            },
            {
                id: 'full-collective',
                label: 'Apply Full Collective',
                description: 'Power through the gusts to maintain altitude.',
                isCorrect: false,
                feedback: 'Incorrect. This places maximum stress on the rotor system during high-load gusts.'
            }
        ]
    }
];
