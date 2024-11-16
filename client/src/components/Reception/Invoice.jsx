import React from 'react'
import ReceptionNavbar from './ReceptionNavbar'

const Invoice = () => {
    const [formData, setFormData] = useState({
        aptID:'',
        invoice_date:'',
        total_amt:'',
        payment_status:'',
    });

    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
    
    const handleSubmit = (e) => {
        
      };
    
    

  return (
    <div>
                <ReceptionNavbar/>
    </div>
  )
}

export default Invoice