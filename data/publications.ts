export type Publication = {
  title: string;
  venue: string;
  year: number;
  url: string;
  kind: "journal" | "conference";
};

// Links supplied by the author; each opens the publisher's or repository's page for the paper.
export const publications: Publication[] = [
  {
    title: "Evaluating XGBoost Performance in Improving Community Security through Multi-Class Crime Prediction: Insights from the Denver Crime Dataset",
    venue: "International Journal of Applied Sciences and Smart Technologies",
    year: 2025,
    url: "https://e-journal.usd.ac.id/index.php/IJASST/article/view/11689",
    kind: "journal",
  },
  {
    title: "Multicriteria Decision Analysis for Stock Selection: A Comparative Study of ELECTRE III with Veto, TOPSIS, and PROMETHEE Methods",
    venue: "International Journal of Engineering and Modern Technology",
    year: 2025,
    url: "https://iiardjournals.org/abstract?id=58330&j=IJEMT&pn=%20Multicriteria%20Decision%20Analysis%20for%20Stock%20Selection%20A,%20Comparative%20Study%20of%20ELECTRE%20III%20with%20Veto,%20TOPSIS,%20and,%20PROMETHEE%20Methods",
    kind: "journal",
  },
  {
    title: "Dense Neural Networks and Local Interpretable Model-agnostic Explanations Hybrid Model for Enhanced Interpretability",
    venue: "International Journal of Computer Science and Mathematical Theory",
    year: 2025,
    url: "https://iiardjournals.org/abstract?id=60198&j=IJCSMT&pn=Dense+Neural+Networks+and+Local+Interpretable+Model-agnostic+Explanations+Hybrid+Model+for+Enhanced+Interpretability",
    kind: "journal",
  },
  {
    title: "Comparative Analysis of K-Nearest Neighbors, Naive Bayes, and Decision Tree Algorithms for Credit Card Fraud Detection",
    venue: "World Journal of Innovation and Modern Technology",
    year: 2025,
    url: "https://www.iiardjournals.org/get/WJIMT/VOL.%209%20NO.%204%202025/Comparative%20Analysis%20of%20K-Nearest%2074-85.pdf",
    kind: "journal",
  },
  {
    title: "Fault Detection in Wind Turbine Blades Using Artificial Intelligence Transfer Learning with ResNet50 on a Small Turbine Dataset",
    venue: "Sustainable, Clean and Emerging Energy Technologies Conference, University of Nigeria, Nsukka (book of abstracts)",
    year: 2024,
    url: "https://www.scribd.com/document/789115267/SCEETC-2024-Book-of-Abstracts-updated",
    kind: "conference",
  },
  {
    title: "Comparison of GoogLeNet Convolutional Neural Network to Visual Geometry Group Convolutional Neural Network",
    venue: "RSU Journal of Biology and Applied Sciences",
    year: 2022,
    url: "https://zenodo.org/records/15593659",
    kind: "journal",
  },
  {
    title: "Efficiency of State-Dependent Proportional Integral Plus over Proportional Integral Plus in the Control of an Air Conditioner with Free Cooling",
    venue: "Irish International Journal of Engineering and Scientific Studies",
    year: 2022,
    url: "https://aspjournals.net/journals/iijess/articles/54/86",
    kind: "journal",
  },
  {
    title: "QoS Performance Evaluation of Video Streaming across IPv6",
    venue: "RSU Journal of Biology and Applied Sciences",
    year: 2022,
    url: "https://zenodo.org/records/15594477",
    kind: "journal",
  },
  {
    title: "Energy Efficiency of Model Predictive Control over Proportional-Integral-Plus towards Control of an Air Conditioner",
    venue: "International Journal of Scientific Research and Engineering Development",
    year: 2021,
    url: "https://ijsred.com/volume4-issue5-part7.html",
    kind: "journal",
  },
  {
    title: "Impact of Node Velocity on TCP Throughput of Mobile Ad-hoc Data Network (MADNET)",
    venue: "European Journal of Engineering and Technology",
    year: 2020,
    url: "https://www.idpublications.org/wp-content/uploads/2020/04/Full-Paper-IMPACT-OF-NODE-VELOCITY-ON-TCP-THROUGHPUT-OF-MOBILE-AD-HOC-DATA-NETWORK.pdf",
    kind: "journal",
  },
  {
    title: "Experimental Assessment of the Impact of Velocity on UDP End-to-End Delay of Mobile Unicast Data Network (MUDNET)",
    venue: "International Journal of Computing and Technology",
    year: 2020,
    url: "https://www.ijcat.org/articles/7-6/Experimental-Assessment-of-the-Impact-of-Velocity-on-UDP-End-to-End-Delay-of-Mobile-Unicast-Data-Network-MUDNET.html",
    kind: "journal",
  },
];
