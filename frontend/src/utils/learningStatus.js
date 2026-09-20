export const getLearningStatus = (score) => {
    if (score >= 80) {
        return "Strong Understanding";
    }

    if (score >= 60) {
        return "Needs More Practice";
    }

    return "Needs Revision";
};

export const getLearningStatusClass = (score) => {
    if (score >= 80) {
        return "strong";
    }

    if (score >= 60) {
        return "practice";
    }

    return "revise";
};

export const getLearningStatusShort = (score) => {
    if (score >= 80) {
        return "Strong";
    }

    if (score >= 60) {
        return "Practice";
    }

    return "Revise";
};