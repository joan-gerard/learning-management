import AccordionSections from "@/components/AccordionSections";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import React from "react";

function SelectedCourseInfo({
  selectedCourse,
  handleEnrollNow,
}: SelectedCourseInfoProps) {
  return (
    <div className="selected-course">
      <div>
        <h3 className="selected-course__title">{selectedCourse.title}</h3>
        <p className="selected-course__author">
          By {selectedCourse.teacherName} |{" "}
          <span className="selected-course__enrollment-count">
            {selectedCourse.enrollments?.length}
          </span>
        </p>
      </div>
      <div className="selected-course__content">
        <p className="selected-course__description">
          {selectedCourse.description}
        </p>
        <div className="selected-course__sections">
          <h4 className="selected-course__sections-title">Course Content</h4>
          {/* ACCORDION */}
          <AccordionSections sections={selectedCourse.sections} />
        </div>
        <div className="selected-course__footer">
          <span className="selected-course__price">
            {formatPrice(selectedCourse.price)}
          </span>
          <Button
            onClick={() => handleEnrollNow(selectedCourse.courseId)}
            className="bg-primary-700 hover:bg-primary-600"
          >
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SelectedCourseInfo;
