import { connectDB } from '@/lib/mongodb';
import ProductModel from "@/models/product";
import { FilterQuery, SortOrder } from 'mongoose';
import { PaginationedData } from '@next-server-actions/types';

interface GetProductsOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: SortOrder;
    id?: string;
    name?: string;
    isActive?: boolean;
    randomOrder?: boolean;
}

export async function getProductsFromDB({
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    id,
    name,
    isActive,
    randomOrder = false,
}: GetProductsOptions): Promise<PaginationedData<any> | any> {
    try {
        await connectDB();
        const skip = (page - 1) * limit;

        if (id) {
            const product = await ProductModel.findById(id).lean();
            if (!product) {
                return { message: "Product not found" };
            }
            return product;
        }

        const filter: FilterQuery<typeof ProductModel> = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (isActive !== undefined) {
            filter.is_active = isActive;
        }

        const totalDocs = await ProductModel.countDocuments(filter);
        let products;
        if (randomOrder) {
            // Aggregate pipeline for random ordering
            products = await ProductModel.aggregate<PaginationedData<any>>([
                { $match: filter },
                { $sample: { size: limit } },
                { $skip: skip }
            ]).exec();
        } else {
            const sort: { [key: string]: SortOrder } = {
                [sortBy]: sortOrder === 'asc' ? 1 : -1,
                _id: 1,
            };

            products = await ProductModel.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit);
        }

        return {
            data: products,
            page,
            limit,
            totalPages: Math.ceil(totalDocs / limit),
            totalDocs,
        };
    } catch (e) {
        return { message: (e as Error).message };
    }
}

export async function getProductById(id: string) {
    return getProductsFromDB({ id });
}

export async function getProductsByName(name: string) {
    return getProductsFromDB({ name });
}