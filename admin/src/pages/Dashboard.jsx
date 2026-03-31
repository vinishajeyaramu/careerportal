import { useContext, useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import axios from "axios";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { ThemeContext } from "../App";

const candidatesUrl = import.meta.env.VITE_CANDIDATES_URL;

export default function Dashboard() {
  const { job } = useContext(ThemeContext);
  const [candidates, setCandidates] = useState([]);
  const name = localStorage.getItem("username");

  useEffect(() => {
    const fetchCandidates = async () => {
      const response = await axios.get(candidatesUrl);
      setCandidates(response.data);
    };

    fetchCandidates();
  }, []);

  const metrics = [
    {
      title: "Total jobs",
      value: job?.length || 0,
      tone: "from-blue-100 to-white",
    },
    {
      title: "Candidates",
      value: candidates?.length || 0,
      tone: "from-emerald-100 to-white",
    },
    {
      title: "Active roles",
      value: job?.filter((item) => item.job_status === "Active").length || 0,
      tone: "from-amber-100 to-white",
    },
    {
      title: "Inactive roles",
      value: job?.filter((item) => item.job_status === "Inactive").length || 0,
      tone: "from-rose-100 to-white",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="admin-panel rounded-[32px] p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[var(--admin-accent-deep)]">
              Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold">Admin panel overview</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--admin-muted)]">
              Track role activity, candidate volume, and hiring status from one place.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--admin-ink)] shadow-sm">
            <FaUserAlt className="text-[var(--admin-accent)]" />
            {name}
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={metric.title}
            className={`admin-card rounded-[28px] bg-gradient-to-br ${metric.tone} p-6`}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--admin-muted)]">
              {metric.title}
            </p>
            <h2 className="mt-4 text-4xl font-bold">{metric.value}</h2>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="admin-panel rounded-[32px] p-6">
          <h2 className="text-xl font-bold">Hiring activity</h2>
          <div className="mt-6 h-[340px]">
            <Bar
              data={{
                labels: ["Roles", "Candidates", "Active", "Inactive"],
                datasets: [
                  {
                    label: "Portal snapshot",
                    backgroundColor: ["#1c5d99", "#12715b", "#ce7a12", "#b9382f"],
                    borderRadius: 10,
                    data: [
                      job?.length || 0,
                      candidates?.length || 0,
                      job?.filter((item) => item.job_status === "Active").length || 0,
                      job?.filter((item) => item.job_status === "Inactive").length || 0,
                    ],
                  },
                ],
              }}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        <div className="grid gap-6">
          <div className="admin-panel rounded-[32px] p-6">
            <h2 className="text-xl font-bold">Role split</h2>
            <div className="mt-6 h-[240px]">
              <Doughnut
                data={{
                  labels: ["Active", "Inactive"],
                  datasets: [
                    {
                      backgroundColor: ["#1c5d99", "#b9382f"],
                      data: [
                        job?.filter((item) => item.job_status === "Active").length || 0,
                        job?.filter((item) => item.job_status === "Inactive").length || 0,
                      ],
                    },
                  ],
                }}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className="admin-panel rounded-[32px] p-6">
            <h2 className="text-xl font-bold">Candidate trend view</h2>
            <div className="mt-6 h-[220px]">
              <Line
                data={{
                  labels: ["Jobs", "Candidates", "Active", "Inactive"],
                  datasets: [
                    {
                      label: "Current totals",
                      borderColor: "#1c5d99",
                      backgroundColor: "rgba(28, 93, 153, 0.12)",
                      tension: 0.4,
                      fill: true,
                      data: [
                        job?.length || 0,
                        candidates?.length || 0,
                        job?.filter((item) => item.job_status === "Active").length || 0,
                        job?.filter((item) => item.job_status === "Inactive").length || 0,
                      ],
                    },
                  ],
                }}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
