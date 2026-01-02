+++
author = "Robert Humphrey"
title = "Bridges and VLANs (pt 1)"
date = "2025-12-30"
+++

In developing using virtual machines or containers it doesn't take long before you'll need to interact with a "bridge" network. They're extremely common as a base networking configuration when working with multiple VMs on a single host, but learning about bridge networks can get confusing quickly. This post is intended to be the start of a guide to bridges and why they're useful when developing with virtual machines.

### What are bridges?

Before we talk about what a "bridge network" is, we need to talk about what a "bridge" is. In the early days of ethernet, clients connected on the same Local Area Network (LAN) were connected to the same physical wires, typically a single coaxial cable. Clients would use Medium Access Control (MAC) protocols to ensure that they were not talking at the same time and interfering with eachother's packets. One major problem with this is as you scale the number of clients, your throughput goes down significantly due to increasing likelihood of collisions.

Engineers at Digital Equipment Corp in the 1980s came up with a way to help improve this reduction in performance, by splitting each LAN into separate sections that shared a single wire, also called a "collision domain". In between each collision domain would be a store-and-forward switch, which would be responsible for forwarding packets from one domain to their destination domain, but blocking packets if they were already on their destination domain. This effectively reduced the number of clients competing for access to the same medium, increasing throughput. The store-and-forward switches became known as bridges.

The layer in the OSI model that deals with MAC is the datalink layer (layer 2), so this is why it's common to hear that bridges are layer 2 devices that join networks.

### Implementation

During operation it is the responsibility of the bridge to maintain a forwarding information base to determine whether and how to forward packets that it receives. It typically does this with Contend-Addressable Memory (CAM) tables, which are a hardware implemented associative array that allow for quickly determining if a address is present in memory. The CAM table is populated as packets arrive with the source address and interface, and forwarded to the interface stored for the destination address. If the destination address is not stored in the CAM table, the packet is "flooded" across all interfaces. This is called "Unicast Flooding", and is the basis for how all modern switches work.

The problem that quickly arises from the unicast flooding technique is that many networks have loops in them. In cases of loops and no mitigating techniques, packets flooded to all interfaces will loop back to the same bridge device again and again, bringing the network to a halt. 

Layer 3 protocols like Internet Protocol (IP) keep track of "hop counts" as the packet passes through the network, allowing packets which exceed a prescribed time-to-live (TTL) to be dropped, which mitigates this issue. Layer 2 protocls were not built with this luxury. Instead, they rely primarily on the Spanning Tree Protocol (STP) to ensure that bridges are only connected in ways that avoid loops, and any links that would create a loop are dropped. Other techniques to avoid network failures due to flooding are techniques like Shortest Path Bridging and TRILL.

### How does a brige differ from a switch?

It doesn't, and the reasons for different names are largely due to marketing. The first bridges sold by DEC were called the LANBridge 100

For part one:
- What are bridges
  - Bridges are devices that join layer 2 networks (primarily ethernet, but also Wi-Fi and others), in a way that is transparent to any layer above them. Bridges and switches perform the same function, and the distinction was primarily due for marketing purposes to avoid the negative connotations due to the initial instability of bridged networks.
  - They operate at the link layer (layer 2)
- Why use physical bridges?
  - 
- History of bridges
  - 
- If they're somewhat outdated, why do we use them?
- Structure of packets going across a network bridge
- Alternatives to bridges in virtual networks

### Sources 

https://spectrum.ieee.org/how-dec-engineers-saved-ethernet
