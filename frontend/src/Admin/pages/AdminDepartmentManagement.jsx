import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../features/admin/adminSlice'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Badge } from '../../components/ui/badge'
import { toast } from 'sonner'
import { Plus, Edit, Trash2 } from 'lucide-react'

const AdminDepartmentManagement = () => {
  const dispatch = useDispatch()
  const { data: departments, isLoading } = useSelector((state) => state.admin.departments)
  const { admin } = useSelector((state) => state.admin)
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [newDepartmentName, setNewDepartmentName] = useState('')
  const [editDepartmentName, setEditDepartmentName] = useState('')

  useEffect(() => {
    dispatch(getAllDepartments())
  }, [dispatch])

  const handleCreateDepartment = async () => {
    if (!newDepartmentName.trim()) {
      toast.error('Department name is required')
      return
    }

    try {
      await dispatch(createDepartment({ 
        name: newDepartmentName.trim(),
        created_by: admin?.id
      })).unwrap()
      setNewDepartmentName('')
      setIsCreateDialogOpen(false)
      toast.success('Department created successfully!')
    } catch (error) {
      toast.error('Failed to create department: ' + (error.message || 'Please try again'))
    }
  }

  const handleUpdateDepartment = async () => {
    if (!editDepartmentName.trim()) {
      toast.error('Department name is required')
      return
    }

    try {
      await dispatch(updateDepartment({ 
        deptId: editingDepartment._id, 
        deptData: { name: editDepartmentName.trim() } 
      })).unwrap()
      setIsEditDialogOpen(false)
      setEditingDepartment(null)
      setEditDepartmentName('')
      toast.success('Department updated successfully!')
    } catch (error) {
      toast.error('Failed to update department: ' + (error.message || 'Please try again'))
    }
  }

  const handleDeleteDepartment = async (deptId) => {
    try {
      await dispatch(deleteDepartment(deptId)).unwrap()
      toast.success('Department deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete department: ' + (error.message || 'Please try again'))
    }
  }

  const openEditDialog = (department) => {
    setEditingDepartment(department)
    setEditDepartmentName(department.name)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Department Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage departments for job postings
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
              <DialogDescription>
                Add a new department for job postings
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Department Name
                </label>
                <Input
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                  placeholder="Enter department name"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateDepartment}
                  disabled={!newDepartmentName.trim() || isLoading}
                >
                  Create Department
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : departments && departments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department Name</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((department) => (
                    <TableRow key={department._id}>
                      <TableCell className="font-medium">{department.name}</TableCell>
                      <TableCell>
                        {department.created_by ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                              {department.created_by.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{department.created_by.name}</div>
                              <div className="text-xs text-slate-500">{department.created_by.email}</div>
                            </div>
                          </div>
                        ) : (
                          <Badge variant="secondary">Unknown</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(department)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDepartment(department._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">No departments found</div>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Department
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update the department name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Department Name
              </label>
              <Input
                value={editDepartmentName}
                onChange={(e) => setEditDepartmentName(e.target.value)}
                placeholder="Enter department name"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateDepartment}
                disabled={!editDepartmentName.trim() || isLoading}
              >
                Update Department
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminDepartmentManagement