import { Request, Response } from 'express';
import Task from "../../../models/task.model"
import paginationHelper from '../../../helpers/pagination'
import searchHelper from '../../../helpers/search'
//[GET] /api/v1/tasks
export const index = async (req: Request, res: Response) => {
    interface Find {
        deleted: boolean,
        status?: string,
        title?: RegExp
    }

    const find: Find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status.toString()
    }

    const sort = {}
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey.toLocaleString()] = req.query.sortValue.toString()
    }

    let objectSearch = searchHelper(req.query)
    if (req.query.keyword) {
        find.title = objectSearch.regex
    }

    //Pagination
    const countTasks = await Task.countDocuments(find)
    const initPagination = {
        currentPage: 1,
        limitItem: 2,
    }
    let objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTasks
    )
    //End Pagination

    const tasks = await Task.find(find).sort().limit(objectPagination.limitItem).skip(objectPagination.skip)
    res.json(tasks)
}

//[GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
    const id = req.params.id
    const tasks = await Task.findOne({
        _id: id,
        deleted: false
    })
    res.json(tasks)
}

//[PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
    try {
        const id: String = req.params.id;
        const status: String = req.body.status
        await Task.updateOne({
            _id: id
        }, {
            $set: {
                status: status
            }
        })
        res.json({
            code: 200,
            message: "Cập nhật thành công!"
        })
    } catch (error) {
        res.json({
            code: 404,
            message: "Không tồn tại!"
        })
    }
}

//[PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
    try {
        enum Key {
            status = "status",
            delete = "delete"
        }
        const key: String = req.body.key
        const value: String = req.body.value
        const ids: String[] = req.body.ids

        switch (key) {
            case Key.status:
                await Task.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    $set: {
                        status: value
                    }
                })
                res.json({
                    code: 200,
                    message: "Cập nhật thành công!"
                })
                break;
            case Key.delete:
                await Task.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    deleted: true,
                    deleteAt: new Date()
                })
                res.json({
                    code: 200,
                    message: "Xóa thành công!"
                })
                break;
            default:
                res.json({
                    code: 404,
                    message: "Không tồn tại!"
                })
                break;
        }
    } catch (error) {
        res.json({
            code: 404,
            message: "Không tồn tại!"
        })
    }
}

//[POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response) => {
    try {
        //req.body.createdBy = req.user.id;
        const task = new Task(req.body);
        const data = await task.save();
        res.json({
            code: 200,
            message: "Thêm mới thành công!",
            data: data
        })
    } catch (error) {
        res.json({
            code: 404,
            message: "Thêm mới Không thành công!"
        })
    }
}

//[PATCH] /api/v1/tasks/edit/:id
export const edit = async (req: Request, res: Response) => {
    try {
        const id: String = req.params.id;
        await Task.updateOne({ _id: id }, req.body)
        const data = await Task.findOne({ _id: id })
        res.json({
            code: 200,
            message: "Cập nhật thành công!",
            data: data
        })
    } catch (error) {
        res.json({
            code: 404,
            message: "Không tồn tại!"
        })
    }
}

//[DELETE] /api/v1/tasks/delete/:id
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const id:String = req.params.id;
        await Task.updateOne({ _id: id }, {
            deleted: true,
            deleteAt: new Date()
        })
        res.json({
            code: 200,
            message: "Xóa thành công!"
        })
    } catch (error) {
        res.json({
            code: 404,
            message: "Không tồn tại!"
        })
    }
}