import JobSearchBoard from "../components/JobSearchBoard";

const JobsExplorer = () => {
  return (
    <main className="pb-16 pt-2">
      <JobSearchBoard
        heading="Explore all jobs"
        subheading="See every added active job here and open any card to view the full job details page."
      />
    </main>
  );
};

export default JobsExplorer;
