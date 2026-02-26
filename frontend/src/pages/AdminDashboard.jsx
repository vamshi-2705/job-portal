import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getJobs, deleteJob, reset as jobReset } from '../store/slices/jobSlice';
import { Users, Briefcase, FileText, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('stats');
    const [stats, setStats] = useState({ totalUsers: 0, totalJobs: 0, totalApplications: 0 });
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);

    const { jobs, isLoading: jobLoading, isSuccess: jobSuccess } = useSelector((state) => state.jobs);

    useEffect(() => {
        fetchStats();

        return () => {
            dispatch(jobReset());
        };
    }, [dispatch]);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/users/admin/stats', { withCredentials: true });
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch stats');
        }
    };

    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const res = await axios.get('/api/users', { withCredentials: true });
            setUsers(res.data);
        } catch (err) {
            toast.error('Failed to fetch users');
        } finally {
            setUsersLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'jobs') {
            dispatch(getJobs(''));
        }
    }, [activeTab, dispatch, jobSuccess]);

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`/api/users/${id}`, { withCredentials: true });
                fetchUsers();
                fetchStats();
                toast.success('User deleted successfully');
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    const handleDeleteJob = async (id) => {
        if (window.confirm('Are you sure you want to delete this job and all its applications?')) {
            try {
                await axios.delete(`/api/jobs/${id}`, { withCredentials: true });
                dispatch(getJobs(''));
                fetchStats();
                toast.success('Job deleted successfully');
            } catch (err) {
                toast.error('Failed to delete job');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
                <p className="mt-1 text-gray-500">System overview and management</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px px-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`${activeTab === 'stats'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`${activeTab === 'users'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Users Directory
                        </button>
                        <button
                            onClick={() => setActiveTab('jobs')}
                            className={`${activeTab === 'jobs'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Jobs Management
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'stats' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-center">
                                <div className="bg-white p-4 rounded-lg shadow-sm mr-4 text-primary-600">
                                    <Users className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{stats.totalUsers}</h3>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-center">
                                <div className="bg-white p-4 rounded-lg shadow-sm mr-4 text-green-600">
                                    <Briefcase className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Total Jobs</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{stats.totalJobs}</h3>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-center">
                                <div className="bg-white p-4 rounded-lg shadow-sm mr-4 text-purple-600">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Total Applications</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{stats.totalApplications}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div>
                            {usersLoading ? (
                                <div className="flex justify-center py-10"><span className="spinner"></span></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.map((user) => (
                                                <tr key={user._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                                user.role === 'recruiter' ? 'bg-green-100 text-green-800' :
                                                                    'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        {user.role !== 'admin' && (
                                                            <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900">
                                                                <Trash2 className="h-4 w-4 inline-block" /> Delete
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'jobs' && (
                        <div>
                            {jobLoading ? (
                                <div className="flex justify-center py-10"><span className="spinner"></span></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posted By</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {jobs?.map((job) => (
                                                <tr key={job._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.company}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.postedBy?.name || 'Unknown'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button onClick={() => handleDeleteJob(job._id)} className="text-red-600 hover:text-red-900">
                                                            <Trash2 className="h-4 w-4 inline-block" /> Delete
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
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
