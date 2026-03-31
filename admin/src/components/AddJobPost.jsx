import {
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import "../index.css";
import toast from "react-hot-toast";

const categoryUrl = import.meta.env.VITE_CATEGORY_URL;
const locationUrl = import.meta.env.VITE_LOCATION_URL;
const jobUrl = import.meta.env.VITE_JOB_URL;

function AddJob({handleOpen,setOpen,isAdd, job, setJob, setIsAdd ,onSuccess}) {
  const [category, setCategory] = useState([]);
  const [location, setLocation] = useState([]);

  const [errors, setErrors] = useState([]);

  const [newJobPost, setNewJobPost] = useState([
    {
      job_title: "",
      job_location_type: [],
      job_category: "",
      job_type: [],
      job_location: "",
      job_experience_level: "",
      job_technical_skills: "",
      job_education_qualification: "",
      job_description: "",
      job_interview_rounds: "",
      job_budget: "",
      job_create_date: "",
      job_close_date: "",
      job_status: "",
      job_created_by: "",
    },
  ]);

  useEffect(() => {
    let created_by = localStorage.getItem("username");
    setNewJobPost((prev) => ({ ...prev, job_created_by: created_by || "" }));
  }, []);

  function handleOpen() {
    setOpen(!open);
  }

  function handleClose() {
    setIsAdd(false);
  }

  const handleSingleFieldChange = (e) => {
    setNewJobPost({ ...newJobPost, [e.target.name]: e.target.value });
  };

  // Job Created Date

  const [createDate, setCreateDate] = useState();

  const handleCreatedDate = (e) => {
    setCreateDate(e.target.value);
    setNewJobPost({ ...newJobPost, job_create_date: createDate });
  };

  // Job Close Date

  const [closeDate, setCloseDate] = useState();

  const handleCloseDate = (e) => {
    setCloseDate(e.target.value);
    setNewJobPost({ ...newJobPost, job_close_date: closeDate });
  };

  // Job Description

  const handleJobDescription = (value) => {
    setNewJobPost({ ...newJobPost, job_description: value });
  };

  // Educational Qualification

  const [education, setEducation] = useState("");
  const [educationalValues, setEducationalValues] = useState([]);

  const handleInputEducationChange = (e) => {
    setEducation(e.target.value);
  };

  const handleKeyDownEducation = (e) => {
    if (e.key === "Enter") {
      addEduValue();
    }
  };

  const addEduValue = () => {
    if (education !== "") {
      setEducationalValues([...educationalValues, education]);
      setEducation("");
    }
  };

  const removeEducation = (index) => {
    const newlocationValues = educationalValues.filter((_, i) => i !== index);
    setEducationalValues(newlocationValues);
  };

  // Mandatory Technical Skills

  const [jobTechSkills, setJobTechSkills] = useState("");
  const [techSkillsValues, setTechSkillsValues] = useState([]);

  const handleInputTechSkillsChange = (e) => {
    setJobTechSkills(e.target.value);
  };

  const handleKeyDownTechSkills = (e) => {
    if (e.key === "Enter") {
      addTechValue();
    }
  };

  const addTechValue = () => {
    if (jobTechSkills !== "") {
      setTechSkillsValues([...techSkillsValues, jobTechSkills]);
      setJobTechSkills("");
    }
  };

  const removeTechnicalSkills = (index) => {
    const newlocationValues = techSkillsValues.filter((_, i) => i !== index);
    setTechSkillsValues(newlocationValues);
  };

  // Job Location Type

  const [locationType, setLocationType] = useState([]);

  const handleLocationType = (event) => {
    const value = event.target.value;
    setLocationType((prevlocationValues) =>
      prevlocationValues.includes(value)
        ? prevlocationValues.filter((v) => v !== value)
        : [...prevlocationValues, value]
    );
  };

  // Job Type

  const [jobType, setJobType] = useState([]);

  const handleJobType = (event) => {
    const value = event.target.value;
    setJobType((prevlocationValues) =>
      prevlocationValues.includes(value)
        ? prevlocationValues.filter((v) => v !== value)
        : [...prevlocationValues, value]
    );
  };

  useEffect(() => {
    axios.get(categoryUrl).then((response) => {
      setCategory(response.data);
    });
  }, [setCategory]);

  useEffect(() => {
    axios.get(locationUrl).then((response) => {
      setLocation(response.data);
    });
  }, [setLocation]);

  function handleSubmit(e) {
    e.preventDefault();

    // Error state
    const errors = {};

    // Validation checks
    if (!newJobPost.job_title)
      errors.job_title = "Job title is required.";
    if (!locationType.length)
      errors.locationType = "Select at least one location type.";
    if (!newJobPost.job_category)
      errors.job_category = "Job category is required.";
    if (!jobType.length) errors.jobType = "Select at least one job type.";
    if (!newJobPost.job_location)
      errors.job_location = "Job location is required.";
    if (!newJobPost.job_experience_level)
      errors.job_experience_level = "Experience level is required.";
    if (!techSkillsValues.length)
      errors.techSkillsValues = "At least one technical skill is required.";
    if (!educationalValues.length)
      errors.educationalValues ="Education qualification is required.";
    if (!newJobPost.job_description)
      errors.job_description = "Job description is required.";
    if (!newJobPost.job_interview_rounds)
      errors.job_interview_rounds = "Interview rounds must be specified.";
    if (!newJobPost.job_budget)
      errors.job_budget = "Budget is required.";
    if (!createDate) errors.createDate = "Created date is required.";
    if (!closeDate) errors.closeDate = "Closing date is required.";
    if (!newJobPost.job_status) errors.job_status = "Job status is required.";

    // If errors exist, prevent submission
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    axios
      .post(
        jobUrl,
        {
          job_title: newJobPost.job_title,
          job_location_type: locationType,
          job_category: newJobPost.job_category,
          job_type: jobType,
          job_location: newJobPost.job_location,
          job_experience_level: newJobPost.job_experience_level,
          job_technical_skills: techSkillsValues,
          job_education_qualification: educationalValues,
          job_description: newJobPost.job_description,
          job_interview_rounds: newJobPost.job_interview_rounds,
          job_budget: newJobPost.job_budget,
          job_create_date: createDate,
          job_close_date: closeDate,
          job_status: newJobPost.job_status,
          job_created_by: newJobPost.job_created_by,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setJob([...job, res.data]);
        setIsAdd(false);
        onSuccess();
        toast.success("Job Added Succesfully...")

      })
      .catch((err) => {
        console.log(err);
        toast.error("Job Added Failed !")
      });
  }

  return (
    <div>
      <Dialog
        size="lg"
        open={open}
        handler={handleOpen}
        className="admin-modal-shell p-4 scrollbar scrollbar-thumb-sky-700 scrollbar-track-sky-300"
      >
        <DialogHeader className="relative font-Josefin  block space-y-4 pb-6">
          <Typography className="font-Josefin" variant="h4" color="blue-gray">
            Create your JobPost
          </Typography>
          <Typography className="mt-1 font-Josefin font-medium text-gray-600">
            Complete the form below with your job details.
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={handleClose}
          >
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>

          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2  text-left font-Josefin font-medium "
            >
              Title
            </Typography>
            <input
              color="gray"
              size="lg"
              placeholder="Enter Job Title"
              name="job_title"
              className=" border-2 w-full text-base p-2 font-Josefin "
              value={newJobPost.job_title}
              onChange={(e) => handleSingleFieldChange(e)}
            />
            {errors.job_title && (
              <p className="text-red-500 text-sm">{errors.job_title}</p>
            )}
          </div>

          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Job Location Type
            </Typography>
            <div className="flex gap-5 text-base">
              <label>
                <input
                  type="checkbox"
                  value="Onsite"
                  className="mr-2"
                  onChange={(event) => handleLocationType(event)}
                />
                Onsite
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  value="Remote"
                  className="mr-2"
                  onChange={(event) => handleLocationType(event)}
                />
                Remote
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  value="Hybrid"
                  className="mr-2"
                  onChange={(event) => handleLocationType(event)}
                />
                Hybrid
              </label>
            </div>
            {errors.locationType && (
              <p className="text-red-500 text-sm">{errors.locationType}</p>
            )}
          </div>

          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Job Category
            </Typography>
            <div className="flex text-base flex-col items-start font-Josefin ">
              <select
                id="statusDropdown"
                className="p-2 border border-gray-300 outline-none"
                name="job_category"
                value={newJobPost.job_category}
                onChange={(e) => handleSingleFieldChange(e)}
              >
                <option>Choose Your Job Category</option>
                {category.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_title}
                  >
                    {category.category_title}
                  </option>
                ))}
              </select>
            </div>
            {errors.job_category && (
              <p className="text-red-500 text-sm">{errors.job_category}</p>
            )}
          </div>

          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Job Type
            </Typography>
            <div className="flex gap-5 text-base">
              <label>
                <input
                  type="checkbox"
                  value="FullTime"
                  className="mr-2"
                  onChange={(event) => handleJobType(event)}
                />
                Full Time
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  value="PartTime"
                  className="mr-2"
                  onChange={(event) => handleJobType(event)}
                />
                Part Time
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  value="Intership"
                  className="mr-2"
                  onChange={(event) => handleJobType(event)}
                />
                Intership
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  value="Contract"
                  className="mr-2"
                  onChange={(event) => handleJobType(event)}
                />
                Contract
              </label>
            </div>
            {errors.jobType && (
              <p className="text-red-500 text-sm">{errors.jobType}</p>
            )}
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Job Location
            </Typography>
            <div className="flex text-base flex-col items-start font-Josefin outline-none">
              <select
                id="statusDropdown"
                className="p-2 border border-gray-300 outline-none"
                name="job_location"
                value={newJobPost.job_location}
                onChange={(e) => handleSingleFieldChange(e)}
              >
                <option>Choose Your Job Location</option>
                {location.map((location) => (
                  <option
                    key={location.location_id}
                    value={location.location_title}
                  >
                    {location.location_title}
                  </option>
                ))}
              </select>
            </div>
            {errors.job_location && (
              <p className="text-red-500 text-sm">{errors.job_location}</p>
            )}
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2  text-left font-Josefin font-medium "
            >
              Experience Level
            </Typography>
            <input
              color="gray"
              size="lg"
              placeholder="Enter Experience Level"
              name="job_experience_level"
              className=" border-2 w-full text-base p-2 font-Josefin "
              value={newJobPost.job_experience_level}
              onChange={(e) => handleSingleFieldChange(e)}
            />
            {errors.job_experience_level && (
              <p className="text-red-500 text-sm">{errors.job_experience_level}</p>
            )}
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Mandatory Technical Skills
            </Typography>

            <div className="flex flex-col items-start ">
              <div className="flex flex-wrap border border-gray-300 rounded  w-full">
                {techSkillsValues.map((value, index) => (
                  <div
                    key={index}
                    className="flex text-base items-center bg-gray-200 p-1 m-1 rounded"
                  >
                    {value}
                    <button
                      onClick={() => removeTechnicalSkills(index)}
                      className="bg-red-500 text-white ml-2 px-2 rounded"
                    >
                      x
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={jobTechSkills}
                  onChange={handleInputTechSkillsChange}
                  onKeyDown={handleKeyDownTechSkills}
                  placeholder="Enter a value and press Enter"
                  className="flex-grow p-2 text-base border-0 focus:ring-0"
                />
              </div>
            </div>
            {errors.techSkillsValues && (
              <p className="text-red-500 text-sm">{errors.techSkillsValues}</p>
            )}
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Education Qualification
            </Typography>

            <div className="flex flex-col items-start ">
              <div className="flex flex-wrap border border-gray-300 rounded  w-full">
                {educationalValues.map((value, index) => (
                  <div
                    key={index}
                    className="flex text-base items-center bg-gray-200 p-1 m-1 rounded"
                  >
                    {value}{" "}
                    <button
                      onClick={() => removeEducation(index)}
                      className="bg-red-500 text-white ml-2 px-2 rounded"
                    >
                      x
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={education}
                  onChange={handleInputEducationChange}
                  onKeyDown={handleKeyDownEducation}
                  placeholder="Enter a value and press Enter"
                  className="flex-grow p-2 text-base border-0 focus:ring-0"
                />
              </div>
            </div>
            {errors.educationalValues && (
              <p className="text-red-500 text-sm">{errors.educationalValues}</p>
            )}
          </div>
          <div className="font-Josefin">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium font-Josefin"
            >
              Job Description
            </Typography>
            <div>
              <ReactQuill
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["bold", "italic", "underline", "strike"],
                    ["link", "image"],
                    [{ align: [] }],
                    ["clean"],
                  ],
                }}
                formats={[
                  "header",
                  "font",
                  "list",
                  "bullet",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "link",
                  "image",
                  "align",
                ]}
                className="mb-4 "
                value={newJobPost.job_description}
                onChange={handleJobDescription}
              />
            </div>
            {errors.job_description && (
              <p className="text-red-500 text-sm">{errors.job_description}</p>
            )}
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2  text-left font-Josefin font-medium "
            >
              Interview Rounds
            </Typography>
            <input
              color="gray"
              size="lg"
              placeholder="Enter Interview Rounds"
              name="job_interview_rounds"
              className=" border-2 w-full text-base p-2 font-Josefin "
              value={newJobPost.job_interview_rounds}
              onChange={(e) => handleSingleFieldChange(e)}
            />
            {errors.job_interview_rounds && (
              <p className="text-red-500 text-sm">{errors.job_interview_rounds}</p>
            )}
          </div>

          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2  text-left font-Josefin font-medium "
            >
              Budget
            </Typography>
            <input
              color="gray"
              size="lg"
              placeholder="Enter Job Budget"
              name="job_budget"
              className=" border-2 w-full text-base p-2 font-Josefin "
              value={newJobPost.job_budget}
              onChange={(e) => handleSingleFieldChange(e)}
            />
            {errors.job_budget && (
              <p className="text-red-500 text-sm">{errors.job_budget}</p>
            )}
          </div>

          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Created Date
            </Typography>
            <div>
              <input
                type="date"
                value={createDate}
                onChange={(e) => handleCreatedDate(e)}
              />
              {errors.createDate && (
                <p className="text-red-500 text-sm">{errors.createDate}</p>
              )}
            </div>
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Valid Through
            </Typography>
            <div>
              <input
                type="date"
                value={closeDate}
                onChange={(e) => handleCloseDate(e)}
              />
              {errors.closeDate && (
                <p className="text-red-500 text-sm">{errors.closeDate}</p>
              )}
            </div>
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Status
            </Typography>
            <div className="flex text-base flex-col items-start font-Josefin ">
              <select
                id="statusDropdown"
                className="p-2 border border-gray-300 outline-none"
                name="job_status"
                value={newJobPost.job_status}
                onChange={(e) => handleSingleFieldChange(e)}
              >
                <option name="null">Choose Status</option>
                <option name="Active" value="Active">
                  Active
                </option>
                <option name="Inactive" value="Inactive">
                  Inactive
                </option>
              </select>
            </div>
            {errors.job_status && (
              <p className="text-red-500 text-sm">{errors.job_status}</p>
            )}
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleSubmit} className="ml-auto !rounded-full !bg-[#1c5d99] !px-5 !py-3 !text-white shadow-none">
            submit
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default AddJob;
