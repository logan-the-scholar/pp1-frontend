"use client";
import { useEffect } from "react";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { ApiProject } from "@/services/api";
import { AppUrl } from "@/types/AppUrl.type";
import { z } from "zod";
import { showPopup } from "@/context/PopupProvider";

const PreMain: React.FC<{ id: string, branch: string }> = ({ branch, id }) => {

    useEffect(() => {

        const fetch = async () => {
            if (!z.string().uuid().safeParse(id).success) {
                window.location.href = AppUrl.Dashboard.from("invalid-id");
            }

            const responseBranches = await ApiProject.getAndBranches(id);

            if (responseBranches instanceof ErrorHelper) {
                window.location.href = `${AppUrl.dashboard}?from=error`;
                return;
            }

            showPopup({
                title: `Repository - ${responseBranches.name}`,
                type: "multiple-select-confirm",
                message: `Select a branch to continue`,
                confirmText: "Select",
                cancelText: "Cancel",
                dismissable: false,
                multiple_options: responseBranches.branches
            }).then(async ({ confirmed, selected }) => {

                if (confirmed) {
                    if (selected === undefined) {
                        window.location.href = AppUrl.Dashboard.from("invalid-branch");
                        return;
                    }

                    window.location.href = AppUrl.Sandbox.id_branch(id, selected);

                } else {
                    window.location.href = AppUrl.dashboard;
                }

                return;

            });

        };

        fetch();

    }, [id, branch]);

    return (
        <div className="h-full w-full">
        </div>
    );
};

export default PreMain;