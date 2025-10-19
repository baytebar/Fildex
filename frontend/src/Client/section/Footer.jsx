import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="border-t border-border bg-card mt-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h4 className="font-bold text-foreground mb-4 text-lg">Fildex Solutions</h4>
                        <p className="text-base text-muted-foreground mb-4">
                            Complete digital service provider delivering website development, software solutions, and business process support.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                            <a href="https://x.com/fildex_solutions" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                                <span className="sr-only">X</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/fildex_solutions" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                                <span className="sr-only">Instagram</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4 text-lg">Services</h4>
                        <ul className="space-y-3">
                            <li><Link to="#training" className="text-muted-foreground hover:text-foreground transition-colors text-base">Training Programs</Link></li>
                            <li><Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors text-base">Career Services</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4 text-lg">Company</h4>
                        <ul className="space-y-3">
                            <li><Link to="#about" className="text-muted-foreground hover:text-foreground transition-colors text-base">About Us</Link></li>
                            <li><Link to="#contact" className="text-muted-foreground hover:text-foreground transition-colors text-base">Contact</Link></li>
                            <li><Link to="#privacy" className="text-muted-foreground hover:text-foreground transition-colors text-base">Privacy Policy</Link></li>
                            <li><Link to="/admin-login" className="text-muted-foreground hover:text-foreground transition-colors text-base">Admin Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4 text-lg">Connect</h4>
                        <ul className="space-y-3">
                            <li><a href="mailto:careers@fildex.ie" className="text-muted-foreground hover:text-foreground transition-colors text-base">careers@fildex.ie</a></li>
                            <li><a href="tel:+35312345678" className="text-muted-foreground hover:text-foreground transition-colors text-base">+353 1 234 5678</a></li>
                            <li><a href="https://wa.me/353123456789" className="text-muted-foreground hover:text-foreground transition-colors text-base">WhatsApp Support</a></li>
                            <li><Link to="#contact" className="text-muted-foreground hover:text-foreground transition-colors text-base">Contact Form</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-base text-muted-foreground">
                        © {new Date().getFullYear()} Fildex Solutions. All rights reserved.
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Hosted on Hetzner</span>
                        <span>•</span>
                        <span>Secured with SSL</span>
                        <span>•</span>
                        <span>GDPR Compliant</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer