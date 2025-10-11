import React from 'react'

const ServiceCard = ({ emoji, title, desc, items = [] }) => {
  return (
    <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
      <div className="text-2xl mb-2">{emoji}</div>
      <div className="font-medium mb-1">{title}</div>
      <div className="text-sm text-purple-300 mb-3">{desc}</div>
      <ul className="text-sm text-purple-200 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2"><span>✔</span><span>{it}</span></li>
        ))}
      </ul>
      <button className="mt-4 w-full rounded-md bg-gradient-to-tr from-purple-500 to-purple-700 px-4 py-2 text-sm font-medium hover:brightness-110 shadow-lg shadow-purple-500/25">Enroll</button>
    </div>
  )
}

const TrainingServices = () => {
  return (
    <section id="training" className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Training Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ServiceCard 
          emoji="☁️" 
          title="Cloud Computing" 
          desc="Comprehensive cloud training covering AWS, Azure, and GCP with hands-on labs and real-world deployments." 
          items={["AWS/Azure/GCP","Serverless Architecture","Kubernetes & Docker"]} 
        />
        <ServiceCard 
          emoji="🔧" 
          title="DevOps Engineering" 
          desc="Master CI/CD pipelines, infrastructure as code, and automation tools for modern software delivery." 
          items={["CI/CD Pipelines","Infrastructure as Code","Monitoring & Logging"]} 
        />
        <ServiceCard 
          emoji="🤖" 
          title="AI/ML Development" 
          desc="Cutting-edge artificial intelligence and machine learning training with practical applications." 
          items={["Python & R","Deep Learning","Data Science"]} 
        />
        <ServiceCard 
          emoji="🌐" 
          title="Networking & Security" 
          desc="Advanced networking concepts and cybersecurity fundamentals for enterprise environments." 
          items={["Network Design","Cybersecurity","Cloud Security"]} 
        />
      </div>
    </section>
  )
}

export default TrainingServices
