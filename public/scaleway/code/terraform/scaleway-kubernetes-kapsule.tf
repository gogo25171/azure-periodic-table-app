resource "scaleway_k8s_cluster" "cluster" {
  name                        = "k8s-${local.naming_suffix}"
  version                     = "1.35.3"
  cni                         = "cilium"
  private_network_id          = scaleway_vpc_private_network.pn.id
  delete_additional_resources = false
}