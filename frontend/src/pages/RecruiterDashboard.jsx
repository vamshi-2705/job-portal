import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getJobs, createJob, deleteJob, reset as jobReset } from '../store/slices/jobSlice';
import { getJobApplicants, updateApplicationStatus } from '../store/slices/applicationSlice';
import { Briefcase, Users, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const RecruiterDashboard = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('jobs');
    const [stats, setStats] = useState({ postedJobsCount: 0, applicationsCount: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingApplicants, setViewingApplicants] = useState(null); // jobId

    const [jobForm, setJobForm] = useState({
        title: '',
        description: '',
        company: '',
        location: '',
        salary: '',
        category: 'Engineering',
        skillsRequired: '',
    });

    const { jobs, isLoading: jobLoading, isSuccess: jobSuccess } = useSelector((state) => state.jobs);
    const { jobApplicants, isLoading: appLoading } = useSelector((state) => state.applications);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        // Fetch stats
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/users/recruiter/stats', { withCredentials: true });
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch stats');
            }
        };

        fetchStats();

        // Fetch jobs posted by this recruiter (server currently returns all jobs, filtering needed or backend fix)
        // Actually our getJobs returns all if no keyword, so we'll fetch all and filter in frontend for recruiter, 
        // or modify getJobs in backend. For MVP we'll just fetch all and filter client side
        dispatch(getJobs(''));

        return () => {
            dispatch(jobReset());
        };
    }, [dispatch, jobSuccess]);

    const recruiterJobs = jobs?.filter(job => job.postedBy?._id === user._id || job.postedBy === user._id) || [];

    const handleCreateJob = (e) => {
        e.preventDefault();
        const newJob = {
            ...jobForm,
            salary: Number(jobForm.salary),
            skillsRequired: jobForm.skillsRequired.split(',').map(s => s.trim()),
        };
        dispatch(createJob(newJob));
        setIsModalOpen(false);
        setJobForm({
            title: '', description: '', company: '', location: '', salary: '', category: 'Engineering', skillsRequired: ''
        });
        toast.success('Job posted successfully');
    };

    const handleDeleteJob = async (id) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await axios.delete(`/api/jobs/${id}`, { withCredentials: true });
                dispatch(getJobs(''));
                toast.success('Job deleted successfully');
            } catch (err) {
                toast.error('Failed to delete job');
            }
        }
    };

    const handleViewApplicants = (jobId) => {
        setViewingApplicants(jobId);
        dispatch(getJobApplicants(jobId));
        setActiveTab('applicants');
    };

    const handleStatusChange = async (appId, status) => {
        try {
            await axios.put(`/api/applications/${appId}/status`, { status }, { withCredentials: true });
            dispatch(getJobApplicants(viewingApplicants));
            toast.success('Status updated');
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Employer Dashboard</h1>
                    <p className="mt-1 text-gray-500">Manage your job postings and applicants</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 md:mt-0 flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Post New Job
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="bg-primary-50 p-4 rounded-lg mr-4 text-primary-600">
                        <Briefcase className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Active Postings</p>
                        <h3 className="text-3xl font-bold text-gray-900">{stats.postedJobsCount}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="bg-green-50 p-4 rounded-lg mr-4 text-green-600">
                        <Users className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Applicants</p>
                        <h3 className="text-3xl font-bold text-gray-900">{stats.applicationsCount}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px px-6" aria-label="Tabs">
                        <button
                            onClick={() => { setActiveTab('jobs'); setViewingApplicants(null); }}
                            className={`${activeTab === 'jobs'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
                        >
                            <div className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-2" />
                                My Job Postings
                            </div>
                        </button>
                        {viewingApplicants && (
                            <button
                                onClick={() => setActiveTab('applicants')}
                                className={`${activeTab === 'applicants'
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
                            >
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-2" />
                                    Review Applicants
                                </div>
                            </button>
                        )}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'jobs' && (
                        <div>
                            {recruiterJobs?.length === 0 ? (
                                <div className="text-center py-12">
                                    <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                                    <p className="text-gray-500 mb-6">Create your first listing to start receiving applications.</p>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                                    >
                                        Post a Job
                                    </button>
                                </div>
                            ) : jobLoading ? (
                                <div className="flex justify-center py-10"><span className="spinner"></span></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role / Title</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Posted</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {recruiterJobs.map((job) => (
                                                <tr key={job._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button onClick={() => handleViewApplicants(job._id)} className="text-primary-600 hover:text-primary-900 mr-4">View Applicants</button>
                                                        {/* <button className="text-gray-600 hover:text-gray-900 mr-4"><Edit className="h-4 w-4" /></button> */}
                                                        <button onClick={() => handleDeleteJob(job._id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'applicants' && viewingApplicants && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Applicants ({jobApplicants?.length || 0})</h3>
                                <button onClick={() => { setActiveTab('jobs'); setViewingApplicants(null); }} className="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Jobs</button>
                            </div>

                            {appLoading ? (
                                <div className="flex justify-center py-10"><span className="spinner"></span></div>
                            ) : jobApplicants?.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">No applicants for this job yet.</div>
                            ) : (
                                <div className="space-y-4">
                                    {jobApplicants?.map((app) => (
                                        <div key={app._id} className="bg-white border text-left border-gray-200 rounded-lg p-5 shadow-sm">
                                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900">{app.applicant?.name}</h4>
                                                    <p className="text-sm text-gray-500 mb-2">{app.applicant?.email}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {app.applicant?.skills?.map(s => (
                                                            <span key={s} className="bg-gray-100 text-xs px-2 py-1 rounded-md text-gray-600">{s}</span>
                                                        ))}
                                                    </div>
                                                    {app.applicant?.resume && (
                                                        <a href={app.applicant.resume} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline text-sm font-medium mt-3 inline-block">
                                                            View Resume Document
                                                        </a>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <select
                                                        value={app.status}
                                                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                                        className={`text-sm rounded-md px-3 py-1.5 font-medium focus:outline-none border ${app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                                app.status === 'shortlisted' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                    'bg-red-50 text-red-700 border-red-200'
                                                            }`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="shortlisted">Shortlisted</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for creating Job */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Post a New Job</h3>
                                        <form onSubmit={handleCreateJob} className="mt-4 space-y-4">
                                            <div><input type="text" required placeholder="Job Title" className="w-full border p-2 rounded" value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} /></div>
                                            <div><input type="text" required placeholder="Company Name" className="w-full border p-2 rounded" value={jobForm.company} onChange={e => setJobForm({ ...jobForm, company: e.target.value })} /></div>
                                            <div><textarea required placeholder="Job Description" className="w-full border p-2 rounded" rows="4" value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })}></textarea></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input type="text" required placeholder="Location" className="w-full border p-2 rounded" value={jobForm.location} onChange={e => setJobForm({ ...jobForm, location: e.target.value })} />
                                                <input type="number" required placeholder="Salary (Annual)" className="w-full border p-2 rounded" value={jobForm.salary} onChange={e => setJobForm({ ...jobForm, salary: e.target.value })} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <select required className="w-full border p-2 rounded bg-white" value={jobForm.category} onChange={e => setJobForm({ ...jobForm, category: e.target.value })}>
                                                    <option value="Engineering">Software Engineering</option>
                                                    <option value="Design">Design</option>
                                                    <option value="Marketing">Marketing</option>
                                                    <option value="Sales">Sales</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <input type="text" required placeholder="Skills (comma separated)" className="w-full border p-2 rounded" value={jobForm.skillsRequired} onChange={e => setJobForm({ ...jobForm, skillsRequired: e.target.value })} />
                                            </div>
                                            <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                                                <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">Post Job</button>
                                                <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterDashboard;
