import 'package:flutter/material.dart';

class SquareButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onTap;

  const SquareButton({
    super.key,
    required this.icon,
    required this.label,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      
      onTap: onTap, 
      child: Container(
        
        margin: const EdgeInsets.symmetric(horizontal: 11.0, ), 
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey[300]!),
          borderRadius: BorderRadius.circular(12),
          color: Colors.white,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: Colors.black),
            const SizedBox(width: 8),
            Text(
              label,
              style: const TextStyle(
                color: Colors.black,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}


class HorizontalButtonList extends StatelessWidget {
  const HorizontalButtonList({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 20), // Adiciona espaço no topo
      height: 56, 
      child: ListView(
        scrollDirection: Axis.horizontal, 
        padding: const EdgeInsets.symmetric(horizontal: 12),
        children: const [
          SquareButton(icon: Icons.favorite_border, label: 'Favorites'),
          SquareButton(icon: Icons.history, label: 'Historic'),
          SquareButton(icon: Icons.person_outline, label: 'Following'),
          SquareButton(icon: Icons.receipt_long, label: 'Orders'),
        ],
      ),
    );
  }
}