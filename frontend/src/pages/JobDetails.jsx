import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getJob } from '../store/slices/jobSlice';
import { applyForJob, saveJob, reset as appReset } from '../store/slices/applicationSlice';
import { Building2, MapPin, DollarSign, Clock, Calendar, Bookmark, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const JobDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { job, isLoading: jobLoading, isError: jobError, message: jobMessage } = useSelector(
        (state) => state.jobs
    );

    const { user } = useSelector((state) => state.auth);
    const {
        isSuccess: appSuccess,
        isError: appError,
        message: appMessage,
        isLoading: appLoading
    } = useSelector((state) => state.applications);

    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        dispatch(getJob(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (appError) {
            toast.error(appMessage);
            dispatch(appReset());
        }

        if (appSuccess) {
            toast.success('Action successful!');
            setHasApplied(true);
            dispatch(appReset());
        }
    }, [appError, appSuccess, appMessage, dispatch]);

    const handleApply = () => {
        if (!user) {
            toast.info('Please login to apply');
            navigate('/login');
            return;
        }

        if (user.role !== 'jobseeker') {
            toast.error('Only job seekers can apply for jobs');
            return;
        }

        dispatch(applyForJob(id));
    };

    const handleSaveJob = () => {
        if (!user) {
            toast.info('Please login to save jobs');
            navigate('/login');
            return;
        }

        if (user.role !== 'jobseeker') {
            toast.error('Only job seekers can save jobs');
            return;
        }

        dispatch(saveJob(id));
    };

    if (jobLoading || !job) {
        return (
            <div className="flex justify-center items-center py-32">
                <span className="spinner"></span>
            </div>
        );
    }

    if (jobError) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-red-50 text-red-700 p-6 rounded-lg max-w-2xl mx-auto border border-red-200">
                    <h3 className="text-xl font-bold mb-2">Error loading job details</h3>
                    <p>{jobMessage}</p>
                    <button
                        onClick={() => navigate('/jobs')}
                        className="mt-6 bg-white text-red-700 font-medium py-2 px-6 rounded border border-red-200 hover:bg-red-50"
                    >
                        Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 py-10 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-500 hover:text-primary-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to listings
                </button>

                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-gray-100 relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-primary-600"></div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{job.title}</h1>
                                <div className="flex items-center text-xl text-primary-600 font-medium mb-4">
                                    <Building2 className="h-5 w-5 mr-2" />
                                    {job.company}
                                </div>
                            </div>

                            <div className="flex gap-3 w-full md:w-auto">
                                {hasApplied ? (
                                    <button disabled className="flex-1 md:flex-none flex items-center justify-center bg-green-50 text-green-700 py-2.5 px-6 rounded-lg font-medium border border-green-200 cursor-not-allowed">
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        Applied
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleApply}
                                        disabled={appLoading}
                                        className="flex-1 md:flex-none bg-primary-600 hover:bg-primary-700 text-white py-2.5 px-8 rounded-lg font-bold shadow-sm transition-colors disabled:opacity-70 flex items-center justify-center"
                                    >
                                        {appLoading ? <span className="spinner w-5 h-5 border-2"></span> : 'Apply Now'}
                                    </button>
                                )}
                                <button
                                    onClick={handleSaveJob}
                                    disabled={appLoading}
                                    className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-200 transition-colors"
                                    title="Save Job"
                                >
                                    <Bookmark className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-6">
                            <span className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 text-sm font-medium">
                                <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                                {job.location}
                            </span>
                            <span className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 text-sm font-medium">
                                <DollarSign className="h-4 w-4 mr-2 text-primary-500" />
                                ${job.salary?.toLocaleString()} / year
                            </span>
                            <span className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 text-sm font-medium">
                                <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                                Posted on {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                            <span className="bg-primary-50 text-primary-700 text-sm px-3 py-1.5 rounded-md font-bold">
                                {job.category}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <div className="w-1 h-6 bg-primary-500 rounded-full mr-3"></div>
                                Job Description
                            </h2>
                            <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {job.description}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <div className="w-1 h-6 bg-primary-500 rounded-full mr-3"></div>
                                Skills Required
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {job.skillsRequired?.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="bg-primary-50 border border-primary-100 text-primary-700 px-4 py-2 rounded-full font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {user && user.role === 'admin' && (
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <p className="text-sm text-gray-400">
                                    Posted by: {job.postedBy?.name} ({job.postedBy?.email})
                                </p>
                                <p className="text-sm text-gray-400">Job ID: {job._id}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
