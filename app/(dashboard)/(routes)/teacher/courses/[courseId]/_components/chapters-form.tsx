"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Chapter, Course } from "@prisma/client";
import { ChaptersList } from "./chapters-list";


interface ChaptersFormProps {
	initialData: Course & {chapters : Chapter[]};
	courseId: string;
}

const formSchema = z.object({
	title:z.string().min(1),
});

export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
	const [isUpdating, setIsUpdating] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title:"",
		},
	});

	const [isCreating , setIsCreating] = useState(false);
    const router = useRouter();
	const { isSubmitting, isValid } = form.formState;
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
            await axios.post(`/api/courses/${courseId}/chapters`,values);
            toast.success("Course Chapter Updated")
            toggleCreating();
            router.refresh();
        } catch  {
            toast.error("Something went wrong")
        }
	};
	const toggleCreating = () => {
		setIsCreating((current) => !current);
	};
	const onReorder = async (updateData: { id: string; position: number }[]) => {};
		try {
			setIsUpdating (true);
			await axios.put(`/api/courses/${courseId}/chapters/reorder`,{
				list:updateData,
			});
			toast.success("Course Chapters Updated");
			router.refresh();
		} catch (error) {
			toast.error("Something went wrong");
		}
		finally{
			setIsUpdating(false);
		}
	};
	return (
		<div className=" mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center  justify-between">
				Course Chapters
				<Button variant="ghost" onClick={toggleCreating}>
					{isCreating ? (
						<>Cancel</>
					) : (
						<>
							<PlusCircle className="h-4 w-4 mr-2" />
							Add a Chapter
						</>
					)}
				</Button>
			</div>
			
			{isCreating && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className=" space-y-4 mt-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="e.g. 'Introduction to the Course'"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

							<Button
								disabled={!isValid || isSubmitting}
								type="submit"
								
							>
								Create
							</Button>
						
					</form>
				</Form>
			)}
			{! isCreating && (
				<div className={cn(
					"text-sm mt-2",
					!initialData.chapters.length && "text-slate-500 italic"
					)}>
					{!initialData.chapters.length && "No Chapters"}
					<ChaptersList
					onEdit={() => {}}
					onReorder = {onReorder}
					items={initialData.chapters || []}
					/>
				</div>
			)}
			{! isCreating && (
				<p className="text-xs text-muted-foreground mt-4 ">
					Drag and Drop to ReOrder the Chapters
				</p>
			)}
		</div>
	);
};
