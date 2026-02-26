import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Building2 } from 'lucide-react';

const JobCard = ({ job }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary-500 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out"></div>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                        <Link to={`/jobs/${job._id}`} className="hover:text-primary-600 transition-colors">
                            {job.title}
                        </Link>
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                        <Building2 className="h-4 w-4 mr-1" />
                        <span>{job.company}</span>
                    </div>
                </div>
                <span className="bg-primary-50 text-primary-700 text-xs px-3 py-1 rounded-full font-medium">
                    {job.category}
                </span>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {job.description}
            </p>

            <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4 text-sm text-gray-500">
                <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {job.location}
                </div>
                <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                    {job.salary.toLocaleString()} / year
                </div>
                <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    {new Date(job.createdAt).toLocaleDateString()}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
                {job.skillsRequired.slice(0, 3).map((skill, index) => (
                    <span
                        key={index}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md"
                    >
                        {skill}
                    </span>
                ))}
                {job.skillsRequired.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                        +{job.skillsRequired.length - 3} more
                    </span>
                )}
            </div>

            <div className="mt-auto">
                <Link
                    to={`/jobs/${job._id}`}
                    className="block w-full text-center bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-600 font-medium py-2 rounded-md transition-colors border border-gray-100 hover:border-primary-100"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default JobCard;
