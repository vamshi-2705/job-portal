import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, reset } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { User as UserIcon, Upload, X, FileText } from 'lucide-react';

const Profile = () => {
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        skills: user?.skills?.join(', ') || '',
    });

    const [resumeFile, setResumeFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const { name, email, password, skills } = formData;

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess) {
            toast.success('Profile updated successfully');
        }

        dispatch(reset());
    }, [isError, isSuccess, message, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const uploadResume = async (e) => {
        e.preventDefault();
        if (!resumeFile) return;

        const data = new FormData();
        data.append('resume', resumeFile);

        setUploading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            };

            const res = await axios.post('/api/upload', data, config);

            // After upload, update profile with new resume URL
            const userData = {
                resume: res.data.url,
            };

            dispatch(updateProfile(userData));
            setResumeFile(null);
            toast.success('Resume uploaded successfully');
        } catch (error) {
            console.error(error);
            toast.error('Resume upload failed');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const userData = {
            name,
            email,
            skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
        };

        if (password) {
            userData.password = password;
        }

        dispatch(updateProfile(userData));
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="h-16 w-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-6">
                            <UserIcon className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                            <p className="text-gray-500 capitalize">{user?.role} Account</p>
                        </div>
                    </div>
                    <span className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 shadow-sm">
                        Member since {new Date(user?.createdAt || Date.now()).getFullYear()}
                    </span>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Form Section */}
                        <div className="lg:col-span-2 space-y-8">
                            <form onSubmit={onSubmit} className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <div className="w-1 h-6 bg-primary-500 rounded-full mr-3"></div>
                                    Personal Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={name}
                                            onChange={onChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={onChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-gray-50 text-gray-500"
                                            disabled
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={onChange}
                                        placeholder="Leave blank to keep current password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>

                                {user?.role === 'jobseeker' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
                                        <input
                                            type="text"
                                            name="skills"
                                            value={skills}
                                            onChange={onChange}
                                            placeholder="e.g. React, Node.js, Python"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                )}

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 flex items-center"
                                    >
                                        {isLoading ? <span className="spinner w-5 h-5 border-2 border-white border-t-transparent mr-2"></span> : null}
                                        Update Profile
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Resume Section */}
                        {user?.role === 'jobseeker' && (
                            <div className="lg:col-span-1 border-l border-gray-100 lg:pl-10">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center lg:items-start">
                                    <div className="w-1 h-6 bg-primary-500 rounded-full mr-3"></div>
                                    Resume
                                </h2>

                                {user.resume ? (
                                    <div className="bg-primary-50 border border-primary-100 p-4 rounded-lg mb-6 flex items-start">
                                        <FileText className="h-8 w-8 text-primary-600 mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 mb-1">Current Resume</p>
                                            <a
                                                href={user.resume}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-primary-600 hover:text-primary-700 text-sm font-medium hover:underline"
                                            >
                                                View Document
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg mb-6">
                                        <p className="text-sm text-yellow-800">No resume uploaded yet. Upload one to apply for jobs.</p>
                                    </div>
                                )}

                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 border-dashed">
                                    <h3 className="text-sm font-medium text-gray-900 mb-4">Upload New Resume</h3>
                                    <form onSubmit={uploadResume}>
                                        <div className="mb-4">
                                            {resumeFile ? (
                                                <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                                                    <span className="text-sm text-gray-600 truncate">{resumeFile.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setResumeFile(null)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center w-full h-32 bg-white border border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                                        <p className="text-xs text-gray-500 text-center px-4">
                                                            <span className="font-semibold text-primary-600">Click to select</span> or drag and drop<br />
                                                            <span className="text-gray-400">PDF, DOC, DOCX</span>
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={(e) => setResumeFile(e.target.files[0])}
                                                    />
                                                </label>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!resumeFile || uploading}
                                            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                                        >
                                            {uploading ? <span className="spinner w-5 h-5 border-2 border-white border-t-transparent mr-2"></span> : null}
                                            {uploading ? 'Uploading...' : 'Upload'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
