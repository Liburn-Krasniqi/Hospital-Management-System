import { PatientService } from "../services/patients.service.js";

// @desc    Get all patients
// @route   GET /api/patients
export async function getPatients(req, res, next) {
  // For pagination
  const take = parseInt(req.body.take);
  const skip = parseInt(req.body.skip);

  const patients = await PatientService.getPatients(take, skip);

  res.status(200).json(patients);
}

// @desc    Get a single post
// @route   GET /api/posts/:id
// export const getPost = (req, res, next) => {
//   const id = parseInt(req.params.id);
//   const post = posts.find((post) => post.id === id);

//   if (!post) {
//     const error = new Error(`A post with the id of ${id} was not found`);
//     error.status = 404;
//     return next(error);
//   }

//   res.status(200).json(post);
// };

// @desc    Create patient
// @route   Post /api/patients
export async function createPatient(req, res, next) {
  const data = req.body;

  const patient = await PatientService.createPatient(data);

  res.status(201).json(patient);
}

// @desc    Update patient
// @route   PUT /api/patients/:id
export async function updatePatient(req, res, next) {
  const id = req.params.id;

  // Check here if patient exists first, if not then stop and return

  const data = req.body;
  const updatedPatient = await PatientService.updatePatient(id, data);

  res.status(200).json(updatedPatient);
}

// @desc    Delete patient
// @route   DELETE /api/patients/:id
export async function deletePatient(req, res, next) {
  const id = req.params.id; //Check later if possible to use query parameters

  const patient = await PatientService.deletePatient(id);

  res.status(200).json(patient);
}
