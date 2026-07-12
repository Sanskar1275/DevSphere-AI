import {
  FaBullseye,
  FaBook,
  FaLaptopCode,
  FaUserGraduate,
} from "react-icons/fa";

function GoalsPanel() {
  const goals = [
    "Finish React Course",
    "Complete DSA Sheet",
    "Apply to 5 Companies",
    "Attend Mock Interview",
  ];

  const icons = [
    <FaBullseye />,
    <FaBook />,
    <FaLaptopCode />,
    <FaUserGraduate />,
  ];

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

      <h2 className="text-2xl font-bold mb-6">
        🎯 Upcoming Goals
      </h2>

      <div className="space-y-5">

        {goals.map((goal, index) => (

          <div
            key={index}
            className="flex items-center gap-4"
          >
            <div className="text-cyan-400 text-xl">
              {icons[index]}
            </div>

            <p className="text-slate-300">
              {goal}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default GoalsPanel;