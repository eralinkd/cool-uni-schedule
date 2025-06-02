export const useStudentApi = () => {
  const { $api } = useNuxtApp()

  const getStudents = async() => (await $api.get('/api/student')).data
  const getStudent = async id => (await $api.get(`/api/student/${id}`)).data

  const postStudent = async p => (await $api.post('/api/admin/students', null, { params: p })).data

  const putStudent = async(
    id,
    p) => (await $api.put(`/api/admin/students/${id}`, null, { params: p })).data

  const deleteStudent = async id =>
    (await $api.delete(`/api/admin/students/${id}`)).data

  return { getStudents, getStudent, postStudent, putStudent, deleteStudent }
}
