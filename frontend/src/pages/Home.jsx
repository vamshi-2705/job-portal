import { Link } from 'react-router-dom';
import { Search, Briefcase, Building2, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword || location) {
            navigate(`/jobs?keyword=${keyword}&location=${location}`);
        } else {
            navigate('/jobs');
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-primary-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0">
                    <svg viewBox="0 0 224 12" fill="currentColor" className="w-full -mb-1 text-gray-50 bg-primary-900" preserveAspectRatio="none">
                        <path d="M0,0 C48,-2 112,-8 224,0 L224,12 L0,12 L0,0 Z"></path>
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 animate-pulse">
                        Find Your <span className="text-primary-400">Dream Job</span> Today
                    </h1>
                    <p className="text-xl max-w-2xl mx-auto text-primary-100 mb-10">
                        Connect with top employers and discover opportunities that match your skills. Thousands of jobs are waiting for you.
                    </p>

                    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-2">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Job title, keywords, or company"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 border-none"
                                />
                            </div>
                            <div className="hidden md:block w-px bg-gray-200 my-2"></div>
                            <div className="flex-1 relative">
                                <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="City, state, or remote"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 border-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-md transition-colors w-full md:w-auto"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="mx-auto bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <Briefcase className="h-8 w-8 text-primary-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">10,000+</h3>
                            <p className="text-gray-500">Active Jobs</p>
                        </div>
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="mx-auto bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <Building2 className="h-8 w-8 text-primary-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">5,000+</h3>
                            <p className="text-gray-500">Companies</p>
                        </div>
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="mx-auto bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <Users className="h-8 w-8 text-primary-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">2M+</h3>
                            <p className="text-gray-500">Candidates</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to take the next step?</h2>
                    <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
                        Create an account today to apply for jobs, save your favorites, and get noticed by top recruiters.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/register"
                            className="bg-primary-600 text-white font-bold py-3 px-8 rounded-md hover:bg-primary-700 transition-colors shadow-sm"
                        >
                            For Job Seekers
                        </Link>
                        <Link
                            to="/register?role=recruiter"
                            className="bg-white text-primary-600 font-bold py-3 px-8 rounded-md border-2 border-primary-600 hover:bg-primary-50 transition-colors"
                        >
                            For Employers
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
