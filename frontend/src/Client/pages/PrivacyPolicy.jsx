import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Mail, Phone, MapPin } from 'lucide-react'
import Header from '../section/Header'
import Footer from '../section/Footer'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 text-primary mr-4" />
              <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <div className="mt-4">
              <Link 
                to="/" 
                className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>

          {/* Last Updated */}
          <div className="bg-muted/50 rounded-lg p-4 mb-8">
            <p className="text-sm text-muted-foreground">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <Eye className="h-6 w-6 text-primary mr-3" />
                Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                At Fildex Solutions, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
                or use our recruitment services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By using our services, you consent to the data practices described in this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <Database className="h-6 w-6 text-primary mr-3" />
                Information We Collect
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-3">Personal Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Name and contact information (email, phone number)</li>
                    <li>Professional information (resume, work experience, skills)</li>
                    <li>Educational background and qualifications</li>
                    <li>Job preferences and career objectives</li>
                    <li>Account credentials and authentication data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-foreground mb-3">Technical Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Website usage data and analytics</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <Users className="h-6 w-6 text-primary mr-3" />
                How We Use Your Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-foreground mb-3">Recruitment Services</h3>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Matching candidates with job opportunities</li>
                    <li>• Processing job applications</li>
                    <li>• Communicating about job opportunities</li>
                    <li>• Conducting background checks (with consent)</li>
                  </ul>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-foreground mb-3">Service Improvement</h3>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Analyzing website usage patterns</li>
                    <li>• Improving our services and user experience</li>
                    <li>• Developing new features and functionality</li>
                    <li>• Conducting research and analytics</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <Lock className="h-6 w-6 text-primary mr-3" />
                Data Retention
              </h2>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Retention Period:</strong> We retain your personal data for <strong>6 months</strong> from the date of collection 
                  or your last interaction with our services, whichever is later. After this period, we will securely delete or 
                  anonymize your personal information unless we are required by law to retain it for a longer period.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  <strong>Extended Retention:</strong> In some cases, we may retain certain information for longer periods if:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 ml-4">
                  <li>Required by applicable laws or regulations</li>
                  <li>Necessary for legitimate business purposes</li>
                  <li>You have given explicit consent for extended retention</li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-3" />
                Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure data centers and infrastructure</li>
                <li>Employee training on data protection practices</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-2 mr-4 mt-1">
                      <Eye className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Access</h3>
                      <p className="text-sm text-muted-foreground">Request a copy of your personal data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-2 mr-4 mt-1">
                      <Database className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Rectification</h3>
                      <p className="text-sm text-muted-foreground">Correct inaccurate or incomplete data</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-2 mr-4 mt-1">
                      <Lock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Erasure</h3>
                      <p className="text-sm text-muted-foreground">Request deletion of your personal data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-2 mr-4 mt-1">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Portability</h3>
                      <p className="text-sm text-muted-foreground">Receive your data in a structured format</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <div className="bg-muted/30 rounded-lg p-6">
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-primary mr-3" />
                    <span className="text-foreground">admin@fildex.ie</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-primary mr-3" />
                    <span className="text-foreground">+353 89 433 1074</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary mr-3" />
                    <span className="text-foreground">Units 1201 & 1202, Building 1000, City Gate, Mahon, Cork, T12 W7CV Cork, Ireland</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="text-foreground">Mon–Fri, 9am–6pm IST</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Changes to Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy 
                Policy periodically for any changes.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default PrivacyPolicy
