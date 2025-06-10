import Navbar from './PatientNavbar'
import PatientAppointment from './PatientAppointment'
import Footer from "../Footer";

const Patient = () => {
  return (
    <>
      <Navbar />
        <PatientAppointment />
      <Footer />
    </>
  );
};

export default Patient;