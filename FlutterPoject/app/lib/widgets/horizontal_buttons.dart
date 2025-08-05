import 'package:flutter/material.dart';

// Widget de botão quadrado com ícone e texto
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
      onTap: onTap, // Ação ao tocar (opcional)
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 8.0), // Espaço entre os botões
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

// Widget principal com a lista horizontal
class HorizontalButtonList extends StatelessWidget {
  const HorizontalButtonList({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 56, // Altura dos botões
      child: ListView(
        scrollDirection: Axis.horizontal, // Permite rolar horizontalmente
        padding: const EdgeInsets.symmetric(horizontal: 12),
        children: const [
          SquareButton(icon: Icons.favorite_border, label: 'Favorites'),
          SquareButton(icon: Icons.history, label: 'Historic'),
          SquareButton(icon: Icons.person_outline, label: 'Following'),
          SquareButton(icon: Icons.receipt_long, label: 'Pedidos'),
     
        ],
      ),
    );
  }
}