import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../store/slices/authSlice';
import { Briefcase, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const getDashboardLink = () => {
        if (!user) return '/';
        switch (user.role) {
            case 'admin':
                return '/dashboard/admin';
            case 'recruiter':
                return '/dashboard/recruiter';
            default:
                return '/dashboard/jobseeker';
        }
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <Briefcase className="h-8 w-8 text-primary-600" />
                            <span className="ml-2 font-bold text-xl tracking-tight text-gray-900">
                                JobPortal
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                        <Link to="/jobs" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium transition-colors">
                            Find Jobs
                        </Link>

                        {user ? (
                            <>
                                <Link to={getDashboardLink()} className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium transition-colors">
                                    Dashboard
                                </Link>
                                <Link to="/profile" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium transition-colors">
                                    Profile
                                </Link>
                                <button
                                    onClick={onLogout}
                                    className="flex items-center text-gray-700 hover:text-red-600 px-3 py-2 rounded-md font-medium transition-colors"
                                >
                                    <LogOut className="h-4 w-4 mr-1" /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium transition-colors">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="sm:hidden border-t border-gray-100 bg-white">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            to="/jobs"
                            className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Find Jobs
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    to={getDashboardLink()}
                                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={onLogout}
                                    className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-gray-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block mx-4 mt-2 mb-2 bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md font-medium text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
