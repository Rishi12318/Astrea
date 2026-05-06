from __future__ import annotations

import json
from pathlib import Path

import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import transforms

from ml.training.config import TrainingConfig
from ml.training.dataset import MakeupFaceDataset
from ml.training.model import SkinToneCNN, TransferSkinToneModel


LABELS = ["Fair", "Light", "Medium", "Tan", "Deep"]
CONFIG = TrainingConfig()


def get_transforms() -> transforms.Compose:
    return transforms.Compose(
        [
            transforms.Resize((CONFIG.image_size, CONFIG.image_size)),
            transforms.RandomHorizontalFlip(),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ]
    )


def train() -> None:
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    dataset = MakeupFaceDataset(
        annotations_csv="ml/datasets/annotations.csv",
        image_root="ml/datasets/images",
        transform=get_transforms(),
    )
    loader = DataLoader(dataset, batch_size=CONFIG.batch_size, shuffle=True, num_workers=0)
    model = TransferSkinToneModel(num_classes=len(LABELS)).to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=CONFIG.learning_rate, weight_decay=CONFIG.weight_decay)
    criterion = nn.CrossEntropyLoss()
    history = {"loss": [], "accuracy": []}

    model.train()
    for epoch in range(CONFIG.epochs):
        running_loss = 0.0
        running_correct = 0
        total = 0
        for images, labels in loader:
            images = images.to(device)
            labels = labels.to(device)
            optimizer.zero_grad()
            logits = model(images)
            loss = criterion(logits, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            predictions = logits.argmax(dim=1)
            running_correct += (predictions == labels).sum().item()
            total += labels.size(0)

        epoch_loss = running_loss / max(total, 1)
        epoch_accuracy = running_correct / max(total, 1)
        history["loss"].append(epoch_loss)
        history["accuracy"].append(epoch_accuracy)
        print(f"epoch={epoch + 1} loss={epoch_loss:.4f} accuracy={epoch_accuracy:.4f}")

    artifact_dir = Path("artifacts")
    artifact_dir.mkdir(parents=True, exist_ok=True)
    torch.save(model.state_dict(), artifact_dir / CONFIG.checkpoint_name)
    (artifact_dir / CONFIG.history_name).write_text(json.dumps(history, indent=2), encoding="utf-8")


if __name__ == "__main__":
    train()
