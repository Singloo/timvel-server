/*
 * File: /Users/origami/Desktop/timvel-server/js/statics/privacy/index.js
 * Project: /Users/origami/Desktop/timvel-server
 * Created Date: Monday April 29th 2019
 * Author: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 * Last Modified: Monday April 29th 2019 11:42:28 am
 * Modified By: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 */
import fs from 'fs';
import path from 'path';
import marked from 'marked';
const privacy = fs.readFileSync(
  path.resolve(__dirname, './privacy.md'),
  'utf8',
);

const str = `
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>Timvel privacy policy</title>
</head>
<body>
<div id="content">
<p>This privacy policy has been compiled to better serve those who are concerned with how their <strong>Personally Identifiable Information</strong> (PII) is being used online. PII, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.</p>
<h3 id="what-personal-information-do-we-collect-from-the-people-that-visit-our-blog-website-or-app">What personal information do we collect from the people that visit our blog, website or app?</h3>
<p>When ordering or registering on our site, as appropriate, you may be asked to enter your email address or other details to help you with your experience.</p>
<h3 id="when-do-we-collect-information">When do we collect information?</h3>
<p>We collect information from you when you register on our site or enter information on our site.</p>
<h3 id="how-do-we-use-your-information">How do we use your information?</h3>
<p>We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:</p>
<ul>
<li>To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.</li>
</ul>
<h3 id="how-do-we-protect-your-information">How do we protect your information?</h3>
<p>We do not use vulnerability scanning and/or scanning to PCI standards.
We do not use Malware Scanning.
Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.
We implement a variety of security measures when a user enters, submits, or accesses their information to maintain the safety of your personal information.
All transactions are processed through a gateway provider and are not stored or processed on our servers.</p>
<h3 id="do-we-use-cookies">Do we use <strong>cookies</strong>?</h3>
<p>We do not use cookies for tracking purposes
You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. Since browser is a little different, look at your browser&#39;s Help Menu to learn the correct way to modify your cookies.
If you turn cookies off, Some of the features that make your site experience more efficient may not function properly.that make your site experience more efficient and may not function properly.</p>
<h3 id="third-party-disclosure">Third-party disclosure</h3>
<p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information.</p>
<h3 id="third-party-links">Third-party links</h3>
<p>We do not include or offer third-party products or services on our website.</p>
<h3 id="google">Google</h3>
<p>Google&#39;s advertising requirements can be summed up by Google&#39;s Advertising Principles. They are put in place to provide a positive experience for users. <a href="https://support.google.com/adwordspolicy/answer/1316548?hl=en">https://support.google.com/adwordspolicy/answer/1316548?hl=en</a> </p>
<p>We have not enabled Google AdSense on our site but we may do so in the future.</p>
<h3 id="california-online-privacy-protection-act">California Online Privacy Protection Act</h3>
<p>CalOPPA is the first state law in the nation to require commercial websites and online services to post a privacy policy. The law**s reach stretches well beyond California to require any person or company in the United States (and conceivably the world) that operates websites collecting Personally Identifiable Information from California consumers to post a conspicuous privacy policy on its website stating exactly the information being collected and those individuals or companies with whom it is being shared. - See more at: <a href="http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf">http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf</a></p>
<p>According to CalOPPA, we agree to the following:
Users can visit our site anonymously.
Once this privacy policy is created, we will add a link to it on our home page or as a minimum, on the first significant page after entering our website.
Our Privacy Policy link includes the word <strong>Privacy</strong> and can easily be found on the page specified above.</p>
<p>You will be notified of any Privacy Policy changes:
    • On our Privacy Policy Page
Can change your personal information:
    • By logging in to your account</p>
<p>How does our site handle Do Not Track signals?
We honor Do Not Track signals and Do Not Track, plant cookies, or use advertising when a Do Not Track (DNT) browser mechanism is in place.</p>
<p>Does our site allow third-party behavioral tracking?
It**s also important to note that we do not allow third-party behavioral tracking</p>
<h3 id="coppa-children-online-privacy-protection-act">COPPA (Children Online Privacy Protection Act)</h3>
<p>When it comes to the collection of personal information from children under the age of 13 years old, the Children&#39;s Online Privacy Protection Act (COPPA) puts parents in control. The Federal Trade Commission, United States&#39; consumer protection agency, enforces the COPPA Rule, which spells out what operators of websites and online services must do to protect children**s privacy and safety online.</p>
<p>We do not specifically market to children under the age of 13 years old.
Do we let third-parties, including ad networks or plug-ins collect PII from children under 13?</p>
<p>Fair Information Practices</p>
<p>The Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts they include have played a significant role in the development of data protection laws around the globe. Understanding the Fair Information Practice Principles and how they should be implemented is critical to comply with the various privacy laws that protect personal information.</p>
<p>In order to be in line with Fair Information Practices we will take the following responsive action, should a data breach occur:
We will notify you via email
    • Within 7 business days</p>
<p>We also agree to the Individual Redress Principle which requires that individuals have the right to legally pursue enforceable rights against data collectors and processors who fail to adhere to the law. This principle requires not only that individuals have enforceable rights against data users, but also that individuals have recourse to courts or government agencies to investigate and/or prosecute non-compliance by data processors.</p>
<h3 id="can-spam-act">CAN SPAM Act</h3>
<p>The CAN-SPAM Act is a law that sets the rules for commercial email, establishes requirements for commercial messages, gives recipients the right to have emails stopped from being sent to them, and spells out tough penalties for violations.</p>
<p>We collect your email address in order to:</p>
<p>To be in accordance with CANSPAM, we agree to the following:</p>
<p>If at any time you would like to unsubscribe from receiving future emails, you can email us at
and we will promptly remove you from ALL correspondence.</p>
</div>
<script>
</script>
</body>
</html>
`;
export default str;