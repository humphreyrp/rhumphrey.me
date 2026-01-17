+++
author = "Robert Humphrey"
title = "Bridges & VLANs (pt 2)"
date = "2026-01-17"
+++

In the previous post I gave a brief overview of what bridges are, and how we use bridge networks when working with Virtual Machines. As hinted in the title, we now want to bring in VLANs, see how they interact with bridge networks, with the eventual goal of creating a VLAN-aware bridge network for multipe virtual machines in Linux.

### History of VLANs

Interestingly, VLANs have a history closely tied to bridges. As soon as networking bridges started being used to join LANs together at layer 2, network admins ran into problems when loops were created in their networks. Because of the previously discussed mechanics of device discovery via unicast flooding, frames sent into a looped network without any mitigation can cause flooding of the network and bring it crashing down. This is where the Spanning Tree Protocol (STP) comes in, which allows bridges to calculate a single spanning tree for the entire network such that there is only a single route from any one node to another, eliminating loops. 

However, this comes at the cost of making routing less efficient, by requiring in many cases frames to take many more hops to reach a destination than strictly required by teh topology. It also making some paths much more highly trafficked than others, particuarly around central hubs. This second problem was what the original implementation of VLANs attempted to solve. By splitting the network into three different "colors" with certain bridges only carrying traffic for a specific color, three separate spanning trees were calculated by the bridges and traffic was more evenly distributed throughout the network. This was referred to at the time as "multi-tree bridging".

The "colors" in the original VLAN implementation became the ethernet frame IEEE 802.1Q header, or VLAN tag.

### Modern Uses

With modern high bandwidth switches, the performance issues VLANs were originally designed to sovled have become less important. However, VLANs are still important to help with the following issues:

- Reducing broadcast domains
- Enhancing Network security
- Better control of quality of service

Let's add some details to each of these.

##### Reducing Broadcast Domains

There are many protocols that require using link-layer broadcasts to function. Broadcasts at the link-layer are frames that are distributed by all switches to all clients on every switch. For example, the Address Resolution Protocol (ARP) is designed to allow hosts on a network to determine the link-layer address of a particular network address, i.e. converting an IP address into a MAC address. in ARP, if a host does not know the MAC address of a particular IP it's trying to talk to, it will send an ARP ethernet frame broadcast to the entire network asking for the target host to respond with it's MAC. Most hosts on the network will simply ignore this, but only after parsing the packet and checking to see if it's them the request is looking for. The larger the network is, the more resources are consumed in this process.

If a network is divided into VLANs, the broadcasted ethernet frames are not sent to devices across VLANs. The only way to communicate across VLANs is via a protocol-layer router, which will filter out broadcast traffic. This significantly reduces the network congestion due to these broadcast protocols.

##### Enhancing Network Security

VLANs are often used to improve network security by partitioning nodes on a network from one another without needing to partition them physically. By partitioning them across different link-layer networks, router settings can be tuned to determine specifically which traffic is allowed to communicate across VLANs. 

It's important to note that using VLANs does not mean a network is secure. There are lots of details in how both switches and routers are setup to ensure that a network is resilient to attacks, most of which go over my head, so they are not addressed here.

##### Control over QoS

Quality of Service controls can be used to prioritize different types of traffic that are more sensitive to particular types of network issues, such as throughput and latency. For example, additional configuration in QoS parameters can be used to ensure that Voice over IP (VoIP) services are given priority over less critical services. These parameters are built directly on top of VLAN functionality built into ethernet frames, particularly, IEEE 802.1P uses the 3-bit priority code built into 802.1Q VLAN header to allow switches to make prioritization decisions when forwarding ethernet frames. 

### Terminology

There are several terms that are helpful to know when learning about VLANs:

- Tags - Refer to the additional 32 bit header added to the ethernet frame as specified by 802.1Q. Inside the header, a 12 bit VLAN identifier is included, allowing for the specification of up to 4094 different VLANs (0 and 4095 are reserved).
- VLAN-Aware - Also can be understood as 802.1Q conformant. All frames within a VLAN-aware portion of a network must be able to be assigned to a single VLAN. In the case of tagged traffic, this is done with the VLAN id. In the case of untagged traffic, it is understood to be on the "native VLAN" (by default VLAN 1).
- Port - The hardware or software providing access to a network switch. A port is always where a VLAN tag is added or removed. There are different types of ports on a VLAN-aware network, described below.
- Access Port - A port that is configured to carry a single VLAN only. When traffic arrives at an access port (ingress), it is tagged with the configured VLAN id and passed along to to the specified target within the VLAN. When traffic exits an access port (egress), the VLAN tag is stripped and passed on to the client untagged. In the case where an access port is assigned to the default VLAN, it does not bother to tag frames on ingress.
- Trunk Port - A port that is configured to carry multiple VLANs. When traffic ingresses at a trunk port, it is either (1) tagged already and compared against rules to determine whether or not it can be forwarded or (2) untagged, in which case forwarded and understood to be on the native VLAN. In this way a network channel attached to a trunk port can carry multiple tagged VLAN frames as well as untagged default VLAN frames.

### Up Next...

In the next post, we will examine how bridges and VLANs interact when setting up a Linux bridge network capable of handling multiple VLANs.
