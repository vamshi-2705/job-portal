import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyApplications, getSavedJobs, withdrawApplication, removeSavedJob } from '../store/slices/applicationSlice';
import { Link } from 'react-router-dom';
import { Briefcase, Bookmark, FileText, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const JobSeekerDashboard = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('applied');

    const { applications, savedJobs, isLoading } = useSelector(
        (state) => state.applications
    );

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMyApplications());
        dispatch(getSavedJobs());
    }, [dispatch]);

    const handleWithdraw = async (id) => {
        if (window.confirm('Are you sure you want to withdraw this application?')) {
            try {
                await axios.delete(`/api/applications/${id}`, { withCredentials: true });
                dispatch(getMyApplications());
                toast.success('Application withdrawn successfully');
            } catch (error) {
                toast.error('Failed to withdraw application');
            }
        }
    };

    const handleRemoveSaved = async (id) => {
        try {
            await axios.delete(`/api/applications/saved/${id}`, { withCredentials: true });
            dispatch(getSavedJobs());
            toast.success('Job removed from saved list');
        } catch (error) {
            toast.error('Failed to remove saved job');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="flex items-center text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full text-xs font-medium border border-yellow-200"><Clock className="h-3 w-3 mr-1" /> Pending</span>;
            case 'shortlisted':
                return <span className="flex items-center text-green-700 bg-green-50 px-3 py-1 rounded-full text-xs font-medium border border-green-200"><CheckCircle className="h-3 w-3 mr-1" /> Shortlisted</span>;
            case 'rejected':
                return <span className="flex items-center text-red-700 bg-red-50 px-3 py-1 rounded-full text-xs font-medium border border-red-200"><XCircle className="h-3 w-3 mr-1" /> Rejected</span>;
            default:
                return <span className="flex items-center text-gray-700 bg-gray-50 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">{status}</span>;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-32">
                <span className="spinner"></span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">My Dashboard</h1>
                    <p className="mt-1 text-gray-500">Welcome back, {user?.name}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="bg-primary-50 p-4 rounded-lg mr-4 text-primary-600">
                        <FileText className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Applications</p>
                        <h3 className="text-3xl font-bold text-gray-900">{applications?.length || 0}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="bg-green-50 p-4 rounded-lg mr-4 text-green-600">
                        <CheckCircle className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Shortlisted</p>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {applications?.filter(app => app.status === 'shortlisted').length || 0}
                        </h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="bg-purple-50 p-4 rounded-lg mr-4 text-purple-600">
                        <Bookmark className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Saved Jobs</p>
                        <h3 className="text-3xl font-bold text-gray-900">{savedJobs?.length || 0}</h3>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px px-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('applied')}
                            className={`${activeTab === 'applied'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
                        >
                            <div className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-2" />
                                Applied Jobs
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`${activeTab === 'saved'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
                        >
                            <div className="flex items-center">
                                <Bookmark className="h-4 w-4 mr-2" />
                                Saved Jobs
                            </div>
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'applied' && (
                        <div>
                            {applications?.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                                    <p className="text-gray-500 mb-6">Start applying to jobs to see them here.</p>
                                    <Link to="/jobs" className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
                                        Browse Jobs
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 rounded-lg">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Role</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {applications?.map((app) => (
                                                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                <Link to={`/jobs/${app.job?._id}`} className="hover:text-primary-600">
                                                                    {app.job?.title || 'Job Unavailable'}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-600">{app.job?.company || 'N/A'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(app.appliedAt).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(app.status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => handleWithdraw(app._id)}
                                                            className="text-red-600 hover:text-red-900 flex items-center justify-end w-full"
                                                            title="Withdraw Application"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'saved' && (
                        <div>
                            {savedJobs?.length === 0 ? (
                                <div className="text-center py-12">
                                    <Bookmark className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs</h3>
                                    <p className="text-gray-500 mb-6">Jobs you bookmark will appear here.</p>
                                    <Link to="/jobs" className="bg-white border border-primary-200 text-primary-600 hover:bg-primary-50 font-medium py-2 px-6 rounded-md transition-colors shadow-sm">
                                        Find Jobs
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {savedJobs?.map((saved) => (
                                        <div key={saved._id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
                                            <button
                                                onClick={() => handleRemoveSaved(saved._id)}
                                                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                                                title="Remove from saved"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>

                                            <h3 className="text-lg font-bold text-gray-900 mb-1 pr-8">
                                                {saved.job?.title || 'Job Unavailable'}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-4">{saved.job?.company || 'N/A'}</p>

                                            {saved.job && (
                                                <div className="mt-4 flex flex-col gap-2">
                                                    <Link
                                                        to={`/jobs/${saved.job._id}`}
                                                        className="block w-full text-center bg-primary-50 text-primary-700 hover:bg-primary-100 py-2 rounded-md text-sm font-medium transition-colors"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobSeekerDashboard;
