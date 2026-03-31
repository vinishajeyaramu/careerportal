import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Nabvar/Navbar";
import Home from "./pages/Home";
import JobsExplorer from "./pages/JobsExplorer";
import JobDetail from "./pages/JobDetail";
import JobApplicationForm from "./pages/JobApplicationForm";
import SuccessJob from "./pages/SuccessJob";
import Error404 from "./pages/Error404";
import JobExpiryPage from "./pages/JobExpiryPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AppliedJobs from "./pages/AppliedJobs";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--surface)] text-[var(--ink)]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobsExplorer />} />
          <Route path="/job/:id/:jobtitle" element={<JobDetail />} />
          <Route path="/job/:id/:jobtitle/apply" element={<JobApplicationForm />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/applied-jobs" element={<AppliedJobs />} />
          <Route path="/success" element={<SuccessJob />} />
          <Route path="/expired" element={<JobExpiryPage />} />
          <Route path="/*" element={<Error404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
