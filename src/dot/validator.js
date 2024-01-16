import joi from 'joi';

const id = joi.number().integer();
const name = joi.string();
const text = joi.string();
const description = joi.string();
const github = joi.string();
const link = joi.string();
const id_category = joi.array().items(id);
const id_stack = joi.array().items(id);

const blog = joi.object({

    name_english: name.alter({
        post: (blog) => blog.required(),
        update: (blog) => blog.optional()
    }),

    name_spanish: name.alter({
        post: (blog) => blog.required(),
        update: (blog) => blog.optional()
    }),

    text_english: text.alter({
        post: (blog) => blog.required(),
        update: (blog) => blog.optional()
    }),

    text_spanish: text.alter({
        post: (blog) => blog.required(),
        update: (blog) => blog.optional()
    }),

    id_category: id_category.alter({
        post: (proyect) => proyect.required(),
        update: (proyect) => proyect.optional()
    })

})

const category = joi.object({
    name: name.alter({
        post: (category) => category.required(),
        update: (category) => category.required(),
    })
})

const stack = joi.object({
    name: name.alter({
        post: (stack) => stack.required(),
        update: (stack) => stack.required(),
    })
})

const proyect = joi.object({
    name_spanish: name.alter({
        post: (proyect) => proyect.required(),
        update: (proyect) => proyect.optional()
    }),

    name_english: name.alter({
        post: (proyect) => proyect.required(),
        update: (proyect) => proyect.optional()
    }),

    description_spanish: description.alter({
        post: (proyect) => proyect.required(),
        update: (proyect) => proyect.optional(),
    }),

    description_english: description.alter({
        post: (proyect) => proyect.required(),
        update: (proyect) => proyect.optional(),
    }),

    github: github.alter({
        post: (proyect) => proyect.required(),
        update: (proyect)=> proyect.optional()
    }),

    link: link.alter({
        post: (proyect) => proyect.required(),
        update: (proyect) => proyect.optional()
    }),

    id_category: id_category.alter({
        post: (proyect) => proyect.required(),
        update: (proyect) => proyect.optional()
    }),

    id_stack: id_stack.alter({
        post: (proyect) => proyect.required(),
        update: (proyect) => proyect.optional()
    }),
})


const singleid = id;


export {blog, category, stack, proyect, singleid};