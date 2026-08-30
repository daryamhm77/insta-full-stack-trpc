"use client";

import type { Post, UpdateProfileInput } from "@repo/trpc/schemas";
import { useParams } from "next/navigation";
import { useState } from "react";
import { EditProfileModal } from "@/components/dashboard/edit-profile-modal";
import { FollowersFollowingModal } from "@/components/users/followers-following-modal";
import { PostModal } from "@/components/users/post-modal";
import ProfileHeader from "@/components/users/profile-header";
import { ProfileNavigation } from "@/components/users/profile-navigation";
import { ProfileTabs } from "@/components/users/profile-tabs";
import { authClient } from "@/lib/auth/auth-client";
import { trpc } from "@/lib/trpc/client";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const { data: session } = authClient.useSession();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [followersFollowingModal, setFollowersFollowingModal] = useState<{
    open: boolean;
    type: "followers" | "following";
  }>({
    open: false,
    type: "followers",
  });
  const utils = trpc.useUtils();

  const { data: profile, isLoading } = trpc.users.getUserProfile.useQuery({
    userId,
  });
  const { data: posts = [] } = trpc.posts.findAll.useQuery({
    userId,
  });
  const { data: savedPosts = [] } = trpc.posts.getSavedPosts.useQuery(
    undefined,
    { enabled: session?.user.id === userId },
  );

  const unfollowMutation = trpc.users.unfollow.useMutation({
    onSuccess: async () => {
      await utils.users.getUserProfile.invalidate({ userId });
    },
  });

  const followMutation = trpc.users.follow.useMutation({
    onSuccess: async () => {
      await utils.users.getUserProfile.invalidate({ userId });
    },
  });

  const updateProfileMutation = trpc.users.updateProfile.useMutation({
    onSuccess: async () => {
      await utils.users.getUserProfile.invalidate({ userId });
    },
  });

  const handleFollowToggle = () => {
    if (!profile) return;
    if (profile.isFollowing) {
      unfollowMutation.mutate({ userId: profile.id });
    } else {
      followMutation.mutate({ userId: profile.id });
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleSaveProfile = (data: UpdateProfileInput) => {
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">User not found</h1>
          <p className="text-muted-foreground">This user doesn&apos;t exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-background">
      <ProfileNavigation />

      <div className="mx-auto max-w-4xl px-8 py-8 sm:px-10">
        <ProfileHeader
          isOwnProfile={session?.user.id === profile.id}
          profile={profile}
          onFollowToggle={handleFollowToggle}
          onEditProfile={() => setIsEditProfileOpen(true)}
          onOpenFollowers={() =>
            setFollowersFollowingModal({ open: true, type: "followers" })
          }
          onOpenFollowing={() =>
            setFollowersFollowingModal({ open: true, type: "following" })
          }
          isFollowLoading={
            followMutation.isPending || unfollowMutation.isPending
          }
        />

        <ProfileTabs
          isOwnProfile={session?.user.id === profile.id}
          userPosts={posts}
          savedPosts={savedPosts}
          name={profile.name}
          onPostClick={handlePostClick}
        />
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}

      <EditProfileModal
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        profile={profile}
        onSave={handleSaveProfile}
      />

      <FollowersFollowingModal
        open={followersFollowingModal.open}
        onOpenChange={(open) => {
          setFollowersFollowingModal({ ...followersFollowingModal, open });
        }}
        userId={userId}
        type={followersFollowingModal.type}
      />
    </div>
  );
}
