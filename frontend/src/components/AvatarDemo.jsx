import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const AvatarDemo = () => {
  const users = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
    { name: 'Mike Johnson', email: 'mike@example.com' },
    { name: 'Sarah Wilson', email: 'sarah@example.com' }
  ]

  const getUserInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  const variants = ['default', 'gradient', 'outline', 'solid']
  const sizes = ['sm', 'default', 'lg', 'xl']

  return (
    <div className="p-8 space-y-8 bg-background">
      <h1 className="text-3xl font-bold text-foreground">Avatar Design Options</h1>
      
      {/* Variants */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Variants</h2>
        <div className="flex flex-wrap gap-6">
          {variants.map((variant) => (
            <div key={variant} className="text-center space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground capitalize">{variant}</h3>
              <div className="flex gap-2">
                {users.slice(0, 2).map((user, index) => (
                  <Avatar key={index} variant={variant} size="default">
                    <AvatarFallback variant={variant}>
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Sizes</h2>
        <div className="flex items-center gap-4">
          {sizes.map((size) => (
            <div key={size} className="text-center space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">{size}</h3>
              <Avatar variant="gradient" size={size}>
                <AvatarFallback variant="gradient">
                  {getUserInitials('John Doe')}
                </AvatarFallback>
              </Avatar>
            </div>
          ))}
        </div>
      </div>

      {/* Current Header Style */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Current Header Style</h2>
        <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-background">
          <Avatar variant="gradient" size="sm">
            <AvatarFallback variant="gradient">
              {getUserInitials('John Doe')}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground">John Doe</span>
        </div>
      </div>

      {/* Alternative Styles */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Alternative Styles</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Outline Style */}
          <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-background">
            <Avatar variant="outline" size="sm">
              <AvatarFallback variant="outline">
                {getUserInitials('John Doe')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">Outline Style</span>
          </div>

          {/* Solid Style */}
          <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-background">
            <Avatar variant="solid" size="sm">
              <AvatarFallback variant="solid">
                {getUserInitials('John Doe')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">Solid Style</span>
          </div>

          {/* Default Style */}
          <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-background">
            <Avatar variant="default" size="sm">
              <AvatarFallback variant="default">
                {getUserInitials('John Doe')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">Default Style</span>
          </div>

          {/* Custom Gradient */}
          <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-background">
            <Avatar className="bg-gradient-to-br from-green-500 to-blue-600" size="sm">
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white font-semibold">
                {getUserInitials('John Doe')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">Custom Gradient</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AvatarDemo
