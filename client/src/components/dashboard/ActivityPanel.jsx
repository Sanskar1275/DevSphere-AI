import {
  FaCheckCircle,
  FaRobot,
  FaBriefcase,
  FaFileAlt,
} from "react-icons/fa";

function ActivityPanel() {
  const activities = [
    {
      icon: <FaCheckCircle className="text-green-400" />,
      text: "Completed React Components Module",
    },
    {
      icon: <FaBriefcase className="text-cyan-400" />,
      text: "Applied for Frontend Internship",
    },
    {
      icon: <FaRobot className="text-purple-400" />,
      text: "Asked AI Mentor 12 Questions",
    },
    {
      icon: <FaFileAlt className="text-yellow-400" />,
      text: "Updated Resume",
    },
  ];

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

      <h2 className="text-2xl font-bold mb-6">
        📈 Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((item, index) => (

          <div
            key={index}
            className="flex items-center gap-4"
          >
            <div className="text-2xl">
              {item.icon}
            </div>

            <p className="text-slate-300">
              {item.text}
            </p>
          </div>

        ))}

      </div>

    </div>
  );
}

export default ActivityPanel;