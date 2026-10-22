import React from "react";
import { LoaderCircle } from "lucide-react";

const PageLoader = ({ label = "Loading…" }) => (
  <div className="page-loader" role="status">
    <LoaderCircle className="spin" aria-hidden="true" />
    <span>{label}</span>
  </div>
);

export default PageLoader;
