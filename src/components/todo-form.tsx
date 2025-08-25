// import {
//   Box,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   Link,
//   Paper,
//   TextField,
//   Typography,
// } from '@mui/material';
// import TodoSchema from '../models/todo-schema';
// import { Form, Formik } from 'formik';
// import type { FC } from 'react';
// import type { UseMutateFunction } from '@tanstack/react-query';
// import type { TodosNewData } from '../types/todos.types';

// type TodoFormProps = {
//   head: string;
//   buttonValue: string;
//   defaultValues: {
//     todo: string;
//     completed: boolean;
//     userId: string;
//   };
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   mutate: UseMutateFunction<any, Error, TodosNewData, unknown>;
//   isPending: boolean;
//   externalText?: string;
//   externalLink?: string;
//   type: 'edit' | 'new';
//   id?: string;
// };

// const TodoForm: FC<TodoFormProps> = ({
//   head,
//   buttonValue,
//   defaultValues,
//   mutate,
//   isPending,
//   externalText,
//   externalLink,
//   type,
//   id,
// }) => {
//   return (
//     <div className="mt-[24px]">
//       <Box sx={{ p: 4, maxWidth: 500, margin: 'auto' }}>
//         <Paper elevation={3} sx={{ p: 4 }}>
//           <div className="flex justify-between gap-[24px]">
//             <Typography variant="h5" fontWeight="bold">
//               {head}
//             </Typography>
//             {externalLink && externalText && (
//               <Link href={externalLink}>{externalText}</Link>
//             )}
//           </div>
//           <div className="mt-[24px]">
//             <Formik
//               initialValues={defaultValues}
//               validationSchema={TodoSchema}
//               onSubmit={async (values) => {
//                 await mutate({
//                   variables: {
//                     ...(type === 'edit' && { documentId: id }),
//                     data: {
//                       todo: values.todo,
//                       completed: values.completed,
//                       userId: values.userId,
//                     },
//                   },
//                 });

//                 // mutate({
//                 //   todo: values.todo,
//                 //   completed: String(values.completed),
//                 //   userId: values.userId,
//                 // });
//               }}>
//               {({ values, handleChange, handleBlur, touched, errors }) => (
//                 <Form>
//                   <Box mb={2}>
//                     <TextField
//                       fullWidth
//                       label="Todo"
//                       name="todo"
//                       value={values.todo}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       error={touched.todo && Boolean(errors.todo)}
//                       helperText={touched.todo && errors.todo}
//                       disabled={isPending}
//                     />
//                   </Box>

//                   <Box mb={2}>
//                     <TextField
//                       fullWidth
//                       label="User ID"
//                       name="userId"
//                       type="number"
//                       value={values.userId}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       error={touched.userId && Boolean(errors.userId)}
//                       helperText={touched.userId && errors.userId}
//                       disabled={isPending}
//                     />
//                   </Box>

//                   <Box mb={2}>
//                     <FormControlLabel
//                       control={
//                         <Checkbox
//                           name="completed"
//                           checked={values.completed}
//                           onChange={handleChange}
//                           disabled={isPending}
//                         />
//                       }
//                       label="Completed"
//                     />
//                   </Box>

//                   <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     disabled={isPending}
//                     fullWidth>
//                     {buttonValue}
//                   </Button>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </Paper>
//       </Box>
//     </div>
//   );
// };

// export default TodoForm;

