const Request = {
	getTemplates() {
		return fetch("http://localhost/select_templates").then(res => res.json());
	},
	getGroupsForCourse(course_id) {
		return fetch("http://localhost/select_groups_for_course?course_id=" 
		+ course_id).then(res => res.json());
	},
	getCoursesForTeacher() {
		return fetch("http://localhost/select_courses_for_teacher").then(res => res.json());
	},
	transferDocumentInfo(task_name, template_id, course_id, group_id) {
		return fetch("http://localhost/transfer_document_info?task_name=" 
		+ task_name + "&template_id=" + template_id + "&course_id=" + course_id + 
		"&group_id=" + group_id, {method: 'POST'});
	},
	getCourseNameById(course_id) {
		return fetch("http://localhost/select_course_name_by_id?id=" + course_id).then(res => res.json());
	},
	getGroupNameById(group_id) {
		return fetch("http://localhost/select_group_name_by_id?id=" + group_id).then(res => res.json());
	},
	getStudentsByGroupId(group_id) {
		return fetch("http://localhost/select_students_by_group_id?group_id=" + group_id).then(res => res.json());
	},
	createTemplate(name, description, document_id, link) {
		return fetch("http://localhost/google/new_template?name=" 
		+ name + "&description=" + description + "&document_id=" 
		+ document_id + "&link=" + link, {method: 'POST'});
	}, 
	editTemplate(id, name, description, link) {
		return fetch("http://localhost/google/update_template?name=" 
		+ name + "&description=" + description + "&link=" + link + "&id=" + id, {method: 'POST'});
	},
	deleteTemplate(template_id) {
		return fetch("http://localhost/google/delete_template?id=" 
		+ template_id, {method: 'POST'});
	},
	createDocuments(task_name, deadline, template_id, course_id, group_id) {
		return fetch("http://localhost/google/create_documents?task_name=" 
		+ task_name + "&deadline=" + deadline + "&template_id=" + template_id + "&course_id=" 
		+ course_id + "&group_id=" + group_id, {method: 'POST'});
	}, 
	getWorksForStudent(course_id, student_id) {
		return fetch("http://localhost/select_works_for_student?course_id=" 
		+ course_id + "&student_id=" + student_id).then(res => res.json());
	},
	getWorkInfo(work_id) {
		return fetch("http://localhost/select_work_info?id=" 
		+ work_id).then(res => res.json());
	},
	changeStatus(work_id) {
		return fetch("http://localhost/change_work_status?id=" 
		+ work_id, {method: 'POST'});
	}
};
 export default Request 