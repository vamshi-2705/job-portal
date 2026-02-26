import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getJobs, reset as jobReset } from '../store/slices/jobSlice';
import JobCard from '../components/JobCard';
import { Search, Filter, X } from 'lucide-react';

const JobListing = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useState({
        keyword: '',
        location: '',
        category: '',
        minSalary: '',
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Parse URL search params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const keyword = params.get('keyword') || '';
        const loc = params.get('location') || '';

        setSearchParams((prev) => ({
            ...prev,
            keyword,
            location: loc,
        }));
    }, [location.search]);

    const { jobs, isLoading, isError, message, pages, page } = useSelector(
        (state) => state.jobs
    );

    useEffect(() => {
        const buildQueryString = () => {
            let query = [];
            if (searchParams.keyword) query.push(`keyword=${searchParams.keyword}`);
            if (searchParams.location) query.push(`location=${searchParams.location}`);
            if (searchParams.category) query.push(`category=${searchParams.category}`);
            if (searchParams.minSalary) query.push(`minSalary=${searchParams.minSalary}`);
            query.push(`page=${1}`); // Default to page 1 for new searches
            return query.join('&');
        };

        dispatch(getJobs(buildQueryString()));

        return () => {
            dispatch(jobReset());
        };
    }, [dispatch, searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Update local state, it will trigger the useEffect
        setSearchParams({ ...searchParams });
    };

    const handleClearFilters = () => {
        setSearchParams({
            keyword: '',
            location: '',
            category: '',
            minSalary: '',
        });
        navigate('/jobs');
    };

    const loadMoreJobs = () => {
        if (page < pages) {
            let query = [];
            if (searchParams.keyword) query.push(`keyword=${searchParams.keyword}`);
            if (searchParams.location) query.push(`location=${searchParams.location}`);
            if (searchParams.category) query.push(`category=${searchParams.category}`);
            if (searchParams.minSalary) query.push(`minSalary=${searchParams.minSalary}`);
            query.push(`page=${page + 1}`);

            dispatch(getJobs(query.join('&')));
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Filters Sidebar Desktop */}
                <div className="hidden md:block w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                            <button
                                onClick={handleClearFilters}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Clear all
                            </button>
                        </div>

                        <form onSubmit={handleSearch} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={searchParams.category}
                                    onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="">All Categories</option>
                                    <option value="Engineering">Software Engineering</option>
                                    <option value="Design">Design / UI/UX</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Support">Customer Support</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 50000"
                                    value={searchParams.minSalary}
                                    onChange={(e) => setSearchParams({ ...searchParams, minSalary: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary-600 text-white hover:bg-primary-700 font-medium py-2 rounded-md transition-colors"
                            >
                                Apply Filters
                            </button>
                        </form>
                    </div>
                </div>

                {/* Mobile Filters button */}
                <div className="md:hidden flex justify-between items-center mb-4">
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center text-gray-700 bg-white border border-gray-300 px-4 py-2 rounded-md shadow-sm"
                    >
                        <Filter className="h-5 w-5 mr-2" />
                        Filters
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Search Bar at top */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Job title, keywords, or company"
                                    value={searchParams.keyword}
                                    onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Location or remote"
                                    value={searchParams.location}
                                    onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-gray-900 text-white hover:bg-gray-800 font-medium py-2 px-6 rounded-md transition-colors"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {jobs?.length > 0 ? jobs.length : 0} Jobs Found
                        </h1>
                    </div>

                    {isLoading && jobs?.length === 0 ? (
                        <div className="flex justify-center py-20">
                            <span className="spinner"></span>
                        </div>
                    ) : isError ? (
                        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
                            {message}
                        </div>
                    ) : jobs?.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs matched your criteria</h3>
                            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
                            <button
                                onClick={handleClearFilters}
                                className="bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium py-2 px-6 rounded-md transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {jobs.map((job) => (
                                    <JobCard key={job._id} job={job} />
                                ))}
                            </div>

                            {page < pages && (
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={loadMoreJobs}
                                        disabled={isLoading}
                                        className="bg-white border text-primary-600 border-primary-200 hover:bg-primary-50 font-medium py-2 px-8 rounded-md transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Loading...' : 'Load More Jobs'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Filter Modal */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={() => setIsFilterOpen(false)}></div>
                    <div className="relative w-full max-w-xs bg-white h-full shadow-xl flex flex-col p-6 overflow-y-auto ml-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                            <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-gray-500">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); setIsFilterOpen(false); handleSearch(e); }} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={searchParams.category}
                                    onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="">All Categories</option>
                                    <option value="Engineering">Software Engineering</option>
                                    <option value="Design">Design</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 50000"
                                    value={searchParams.minSalary}
                                    onChange={(e) => setSearchParams({ ...searchParams, minSalary: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { handleClearFilters(); setIsFilterOpen(false); }}
                                    className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-2 rounded-md transition-colors"
                                >
                                    Clear
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary-600 text-white hover:bg-primary-700 font-medium py-2 rounded-md transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobListing;
