import logo from "../../assets/svgs/resumify.svg";
const Footer = () => {
  return (
    <>
      <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500">
        <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6 mt-40">
          <div className="md:max-w-96">
            <img src={logo} alt="logo" width={120} height={120} />
            <p className="mt-6 text-sm">
              Resumify helps you create polished, professional resumes in
              minutes with modern templates, easy customization, and content
              designed to make your skills stand out with confidence.
            </p>
          </div>
          <div className="flex-1 flex items-start md:justify-end gap-20">
            <div>
              <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-green-600 transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-600 transition">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-600 transition">
                    Contact us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-600 transition">
                    Privacy policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-semibold mb-5 text-gray-800">Get in touch</h2>
              <div className="text-sm space-y-2">
                <p>+1-212-456-7890</p>
                <p>contact@example.com</p>
              </div>
            </div>
          </div>
        </div>
        <p className="pt-4 text-center text-xs md:text-sm pb-5">
          Copyright 2026 © <a href="#">Resumify</a>. All Right Reserved.
        </p>
      </footer>
    </>
  );
};

export default Footer;
