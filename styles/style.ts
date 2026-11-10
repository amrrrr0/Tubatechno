const styles = {
    boxWidth: "max-w-[1480px] 2xl:max-w-[1640px] w-full",

    heading2: "font-jakarta font-extrabold text-[28px] sm:text-[36px] md:text-[42px] text-slate-900 leading-tight tracking-tight w-full",
    paragraph: "font-jakarta font-normal text-slate-600 text-[14.5px] sm:text-[15.5px] leading-relaxed",

    flexCenter: "flex justify-center items-center",
    flexStart: "flex justify-center items-start",

    paddingX: "px-6 sm:px-10 lg:px-16 2xl:px-24",
    paddingY: "sm:py-20 py-12",
    padding: "px-6 sm:px-10 lg:px-16 py-12 sm:py-16",

    marginX: "sm:mx-12 mx-6",
    marginY: "sm:my-20 my-12",
};

export const layout = {
    section: `flex md:flex-row flex-col ${styles.paddingY}`,
    sectionReverse: `flex md:flex-row flex-col-reverse ${styles.paddingY}`,

    sectionImgReverse: `flex-1 flex ${styles.flexCenter} md:mr-10 mr-0 md:mt-0 mt-10 relative`,
    sectionImg: `flex-1 flex ${styles.flexCenter} md:ml-10 ml-0 md:mt-0 mt-10 relative`,

    sectionInfo: `flex-1 ${styles.flexStart} flex-col`,
};

export default styles;
