import React from 'react'

const ContactUs = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here (e.g., sending data to the server)
        // You can access form data using event.target.<input_name>.value
      };
    return (
        <div>
            <div className="wrapper">
                <form className="form" action="process_form.php" method="POST" onSubmit={handleSubmit}>
                    <div className="pageTitle title">CONTACT US </div>
                    <input type="text" className="name formEntry" placeholder="Name" name="name" required />
                    <input type="text" className="email formEntry" placeholder="Email" name="email" required />
                    <textarea className="message formEntry" placeholder="Message" name="message" required></textarea>
                    <div className="submit formEntry">
                        <input type="submit" value="Submit" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ContactUs