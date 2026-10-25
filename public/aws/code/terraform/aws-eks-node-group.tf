resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "main"
  node_role_arn   = aws_iam_role.main.arn
  subnet_ids      = aws_subnet.main[*].id

  scaling_config {
    desired_size = 1
    max_size     = 2
    min_size     = 1
  }

  update_config {
    max_unavailable = 1
  }

  # Ensure that IAM Role permissions are created before and deleted after EKS Node Group handling.
  # Otherwise, EKS will not be able to properly delete EC2 Instances and Elastic Network Interfaces.
  depends_on = [
    aws_iam_role_policy_attachment.main-AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.main-AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.main-AmazonEC2ContainerRegistryReadOnly,
  ]
}