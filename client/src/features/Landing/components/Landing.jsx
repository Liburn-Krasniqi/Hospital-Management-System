import { Stethoscope, Calendar, Shield } from "lucide-react";
import { Link } from "react-router-dom";

import { LandingCard } from "./LandingCard";
import classes from "./Landing.module.css";

export function Landing() {
  return (
    <div className="d-flex flex-column justify-content-center mt-5">
      <div className="d-flex justify-content-center mt-5">
        <div className="text-center mx-5 px-5">
          <img
            src="medical-icon-CVA92fXG.jpg"
            width="80"
            height="80"
            className="rounded-4 mb-3"
            alt="medical icon"
          />
          <h1 className="fw-bold">
            Your Health,{" "}
            <span className={classes.gradient_text}>Our Priority</span>
          </h1>
          <p className={`fw-bold ${classes.paragraph}`}>
            Experience seamless healthcare management with our modern hospital
            system. Book appointments, manage your health, and connect with top
            specialists.
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-3 mb-4">
        <Link style={{ textDecoration: "none" }} to="/appointments">
          <button className="d-flex flex-row background-3 px-3 pt-2 pb-1 rounded-2 align-items-center shadow border-0">
            {/* <Calendar size={24} className="align-self-center" /> */}
            <h2 className="text-center color-white">Book Appointment</h2>
          </button>
        </Link>
      </div>

      <div className="d-flex justify-content-center gap-3 mt-3 mb-5">
        <LandingCard
          title="Expert Doctors"
          text="Connect with certified specialists across all medical fields"
          buttonText="Learn More"
        >
          <Stethoscope size={32} className="text-primary" />
        </LandingCard>

        <LandingCard
          title="Easy Scheduling"
          text="Book appointments instantly with real-time availability"
          buttonText="Learn More"
        >
          <Calendar size={32} className="text-primary" />
        </LandingCard>

        <LandingCard
          title="Secure & Private"
          text="Your health data is protected with enterprise-grade security"
          buttonText="Learn More"
        >
          <Shield size={32} className="text-primary" />
        </LandingCard>
      </div>
    </div>
  );
}
