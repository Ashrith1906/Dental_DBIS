const Footer = () => {
  return (
    <footer className="bg-teal-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 text-center">
        {/* Info section */}
        <div className="mb-2 border-b border-teal-600 pb-2">
          <h2 className="text-lg font-semibold text-white mb-1">
            Smile Dental Clinic
          </h2>
          <p className="text-teal-200 text-xs">
            This website is currently under development.
          </p>
          <p className="text-teal-200 text-xs">
            Please check back soon for updates and new features.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-teal-300 text-xs">
          &copy; {new Date().getFullYear()} Smile Dental Clinic. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;